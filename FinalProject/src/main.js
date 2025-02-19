import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// ------------------------------------------------------
// 1. Setup Scene, Camera, Renderer, and Controls
// ------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Adjusted camera FOV and far plane to avoid clipping
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1, // near plane
  5000 // far plane increased from 1000 to 5000
);
// Raise the camera so we see the ring from above
camera.position.set(0, 400, 2000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ------------------------------------------------------
// 2. HDR Environment
// ------------------------------------------------------
const rgbeLoader = new RGBELoader();
rgbeLoader.load("assets/hdr/wrestling_gym_2k.hdr", (hdrTexture) => {
  hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdrTexture;
  scene.environment = hdrTexture;
});

// ------------------------------------------------------
// 3. Lights
// ------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotlight1 = new THREE.SpotLight(0xffffff, 8);
spotlight1.position.set(0, 20, 0);
spotlight1.angle = Math.PI / 3;
spotlight1.penumbra = 0.2;
spotlight1.castShadow = true;
spotlight1.target.position.set(0, 0, 0);
scene.add(spotlight1);
scene.add(spotlight1.target);

const spotlight2 = new THREE.SpotLight(0xffffff, 4);
spotlight2.position.set(10, 10, 10);
spotlight2.angle = Math.PI / 3;
spotlight2.penumbra = 0.2;
spotlight2.castShadow = true;
spotlight2.target.position.set(0, 0, 0);
scene.add(spotlight2);
scene.add(spotlight2.target);

const spotlight3 = new THREE.SpotLight(0xffffff, 4);
spotlight3.position.set(-10, 10, -10);
spotlight3.angle = Math.PI / 3;
spotlight3.penumbra = 0.2;
spotlight3.castShadow = true;
spotlight3.target.position.set(0, 0, 0);
scene.add(spotlight3);
scene.add(spotlight3.target);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 20, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ------------------------------------------------------
// 4. Load the Boxing Ring Model (GLTF)
// ------------------------------------------------------
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "assets/models/professional_boxing_ring_arena.glb",
  (gltf) => {
    const ring = gltf.scene;
    ring.scale.set(30, 30, 30);
    // Place the ring at the origin so it doesn't clip
    ring.position.set(0, -1000, 0);

    ring.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(ring);
  },
  undefined,
  (error) => {
    console.error("Error loading ring model:", error);
  }
);

// ------------------------------------------------------
// 5. Load Adam Character (Idle + Combo)
// ------------------------------------------------------
const fbxLoader = new FBXLoader();

let adamMixer, adamIdleAction, adamComboAction, adamCurrentAction;
let adamComboDuration = 0;

fbxLoader.load("assets/models/adamIdle.fbx", (object) => {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Adjust scale & position so he's on the ring
  object.scale.set(8, 8, 8);
  // Position him at the ring floor (assuming ring floor is near y=0)
  object.position.set(-30, -600, -380);

  scene.add(object);
  adamMixer = new THREE.AnimationMixer(object);

  // Use the second clip (index 1) for idle
  if (object.animations.length > 1) {
    adamIdleAction = adamMixer.clipAction(object.animations[1]);
    adamIdleAction.loop = THREE.LoopRepeat;
    adamIdleAction.play();
    adamCurrentAction = adamIdleAction;
  } else {
    console.warn("Adam Idle FBX has no proper idle animation.");
  }
});

fbxLoader.load("assets/models/adamCombo.fbx", (object) => {
  if (object.animations.length > 0) {
    // We'll set up comboAction once adamMixer is ready
    setTimeout(() => {
      if (adamMixer) {
        adamComboAction = adamMixer.clipAction(object.animations[0]);
        adamComboAction.setLoop(THREE.LoopOnce, 1);
        adamComboAction.clampWhenFinished = true;
        adamComboDuration = object.animations[0].duration;
      }
    }, 500);
  }
});

const revertAdamIdle = () => {
  if (adamIdleAction) {
    adamIdleAction.reset().fadeIn(0.3).play();
    adamCurrentAction = adamIdleAction;
  }
};

// ------------------------------------------------------
// 6. Load James Character (Idle, Uppercut, Dying)
// ------------------------------------------------------
let jamesMixer,
  jamesIdleAction,
  jamesUppercutAction,
  jamesDyingAction,
  jamesCurrentAction;
let jamesUppercutDuration = 0,
  jamesDyingDuration = 0;

fbxLoader.load("assets/models/jamesIdle.fbx", (object) => {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Adjust scale & position so he's on the ring
  object.scale.set(8, 8, 8);
  // Place him near the ring center but facing Adam
  object.position.set(30, -600, 300);
  object.rotation.y = Math.PI;

  scene.add(object);
  jamesMixer = new THREE.AnimationMixer(object);

  if (object.animations.length > 0) {
    jamesIdleAction = jamesMixer.clipAction(object.animations[0]);
    jamesIdleAction.loop = THREE.LoopRepeat;
    jamesIdleAction.play();
    jamesCurrentAction = jamesIdleAction;
  } else {
    console.warn("James Idle FBX has no animations.");
  }
});

// James uppercut
fbxLoader.load("assets/models/jamesUppercut.fbx", (object) => {
  if (object.animations.length > 0) {
    setTimeout(() => {
      if (jamesMixer) {
        jamesUppercutAction = jamesMixer.clipAction(object.animations[0]);
        jamesUppercutAction.setLoop(THREE.LoopOnce, 1);
        jamesUppercutAction.clampWhenFinished = true;
        jamesUppercutDuration = object.animations[0].duration;
      }
    }, 500);
  }
});

// James dying
fbxLoader.load("assets/models/jamesZombieDeath.fbx", (object) => {
  if (object.animations.length > 0) {
    setTimeout(() => {
      if (jamesMixer) {
        jamesDyingAction = jamesMixer.clipAction(object.animations[0]);
        jamesDyingAction.setLoop(THREE.LoopOnce, 1);
        jamesDyingAction.clampWhenFinished = true;
        jamesDyingDuration = object.animations[0].duration;
      }
    }, 500);
  }
});

const revertJamesIdle = () => {
  if (jamesIdleAction) {
    jamesIdleAction.reset().fadeIn(0.3).play();
    jamesCurrentAction = jamesIdleAction;
  }
};

// ------------------------------------------------------
// 7. Keyboard Controls
// ------------------------------------------------------
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  // Adam's combo (P)
  if (key === "p" && adamComboAction && adamCurrentAction !== adamComboAction) {
    adamCurrentAction.fadeOut(0.3);
    adamComboAction.reset().fadeIn(0.3).play();
    adamCurrentAction = adamComboAction;
    setTimeout(revertAdamIdle, (adamComboDuration + 0.3) * 1000);
  }

  // James' uppercut (U)
  if (
    key === "u" &&
    jamesUppercutAction &&
    jamesCurrentAction !== jamesUppercutAction
  ) {
    jamesCurrentAction.fadeOut(0.3);
    jamesUppercutAction.reset().fadeIn(0.3).play();
    jamesCurrentAction = jamesUppercutAction;
    setTimeout(revertJamesIdle, (jamesUppercutDuration + 0.3) * 1000);
  }

  // James' dying (D)
  if (
    key === "d" &&
    jamesDyingAction &&
    jamesCurrentAction !== jamesDyingAction
  ) {
    jamesCurrentAction.fadeOut(0.3);
    jamesDyingAction.reset().fadeIn(0.3).play();
    jamesCurrentAction = jamesDyingAction;
    setTimeout(revertJamesIdle, (jamesDyingDuration + 0.3) * 1000);
  }
});

// ------------------------------------------------------
// 8. Animation Loop
// ------------------------------------------------------
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (adamMixer) adamMixer.update(delta);
  if (jamesMixer) jamesMixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ------------------------------------------------------
// 9. Handle Window Resizing
// ------------------------------------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
