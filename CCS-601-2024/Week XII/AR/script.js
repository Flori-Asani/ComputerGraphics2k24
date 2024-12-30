import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; 
renderer.setClearColor(0x000000, 0); 

document.getElementById("scene").appendChild(renderer.domElement);
document.getElementById("scene").appendChild(ARButton.createButton(renderer));

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
cube.visible = false; 
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const controller = renderer.xr.getController(0);
controller.addEventListener('select', () => {
    cube.position.set(0, 0, -2).applyMatrix4(controller.matrixWorld); 
    cube.visible = true; 
});
scene.add(controller);

const animate = () => {
    if (cube.visible) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
