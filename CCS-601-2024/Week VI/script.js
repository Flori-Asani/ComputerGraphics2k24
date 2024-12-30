import * as THREE from 'three';

const scene = new THREE.Scene();

const emissiveMaterial = new THREE.MeshStandardMaterial({
    color:0x555555,
    emissive:0x00ff00,
    emissiveIntensity:0.8
});

const glowingCube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),emissiveMaterial);
scene.add(glowingCube);

const phongMaterial = new THREE.MeshPhongMaterial({
    color:0xff0000,
    specular:0xff0000,
    shininess:100
});
const shiningSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,32,32),phongMaterial);
shiningSphere.position.x = 2;
scene.add(shiningSphere);

const transparentMaterial =  new THREE.MeshStandardMaterial({
    color:0x00ff00,
    transparent:true,
    opacity:0.7
});
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2,2), transparentMaterial);
scene.add(plane);

const transparentBox = new THREE.Mesh(new THREE.BoxGeometry(2,0.5,1), transparentMaterial);
transparentBox.position.x = 1;
scene.add(transparentBox);

const startColor = new THREE.Color(0xff0000);
const endColor = new THREE.Color(0x0000ff);

const interpolatedColor = startColor.clone().lerp(endColor, 0.5);
const interpolatedMaterial = new THREE.MeshBasicMaterial({color:interpolatedColor});
const interpolatedCube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), interpolatedMaterial);
interpolatedCube.position.y = 1;
scene.add(interpolatedCube);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(2,2,2);
scene.add(pointLight);

const sizes = {
    width:800,
    height:600
}

const camera =  new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.z = 3;
camera.position.x = 1;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(800,600); //renderer.setSize(800,600);
document.getElementById("scene").appendChild(renderer.domElement)

renderer.render(scene,camera);