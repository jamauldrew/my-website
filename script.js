import * as THREE from "three";
import{OrbitControls}from 'three/examples/jsm/controls/OrbitControls.js';
import{OBJLoader}from 'three/examples/jsm/loaders/OBJLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('threejs-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Adding lighting
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Load the model
const loader = new THREE.OBJLoader(); // or THREE.STLLoader() for STL files
loader.load(
    './resources/obj/Assem1.obj', // or 'model.stl'
    function (object) {
        scene.add(object);
        object.position.set(0, 0, 0);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened during loading the model', error);
    }
);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    renderer.render(scene, camera);
}

animate();
