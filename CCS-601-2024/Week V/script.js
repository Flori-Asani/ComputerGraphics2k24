import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,          
    roughness: 0.5,
    wireframe: true            
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const tick = () => {

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
