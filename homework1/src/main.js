import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(30, 20, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x8fbc8f });
const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), grassMaterial);
grass.rotation.x = -Math.PI / 2;
scene.add(grass);

const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x2f4f4f });
const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(30, 5), roadMaterial);
mainRoad.position.set(0, 0.01, 8);
mainRoad.rotation.x = -Math.PI / 2;
scene.add(mainRoad);

const sideRoad = new THREE.Mesh(new THREE.PlaneGeometry(5, 10), roadMaterial);
sideRoad.position.set(0, 0.02, -5);
sideRoad.rotation.x = -Math.PI / 2;
scene.add(sideRoad);

const buildingMaterialWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });

const leftBuilding = new THREE.Mesh(
  new THREE.BoxGeometry(15, 8, 5),
  buildingMaterialWhite
);
leftBuilding.position.set(-12, 4, -2);
leftBuilding.rotation.y = -Math.PI / 8;
scene.add(leftBuilding);

const rightBuilding = new THREE.Mesh(
  new THREE.BoxGeometry(15, 8, 5),
  buildingMaterialWhite
);
rightBuilding.position.set(12, 4, -2);
rightBuilding.rotation.y = Math.PI / 8;
scene.add(rightBuilding);

const buffetMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const buffet = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 4, 3, 32),
  buffetMaterial
);
buffet.position.set(0, 1.5, -5);
scene.add(buffet);

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const movingSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  sphereMaterial
);
movingSphere.position.set(20, 1, 0);
scene.add(movingSphere);

function animateSphere() {
  gsap.to(movingSphere.position, {
    duration: 10,
    repeat: -1,
    ease: "none",
    onUpdate: () => {
      const angle = gsap.globalTimeline.time() * 0.2;
      movingSphere.position.set(15 * Math.cos(angle), 1, 15 * Math.sin(angle));
    },
  });
}

animateSphere();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
