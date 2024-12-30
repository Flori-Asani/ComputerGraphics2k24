 import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

 const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;  

document.getElementById("scene").appendChild(renderer.domElement);
document.getElementById("scene").appendChild(VRButton.createButton(renderer));

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

 const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

 
animate();

 window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
