import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js';

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2.5, 7); // Move the camera up by 50% (originally 5 units up)
scene.add(camera);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Further increased intensity
scene.add(ambientLight);

// Directional Lights
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(5, 5, 5);
directionalLight1.castShadow = true; // Enable shadows
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight2.position.set(-5, 5, 5);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight3.position.set(0, 10, 0); // Light from directly above
directionalLight3.castShadow = true; // Enable shadows
scene.add(directionalLight3);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // Enable transparency
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // Set background to transparent
renderer.shadowMap.enabled = true; // Enable shadow maps

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

const loader = new GLTFLoader();
let model, mixer;

loader.load(
  "animationdance.glb", // Ensure this path is correct
  function (gltf) {
    model = gltf.scene;
    model.scale.set(3.5, 3.5, 3.5); // Scale the model to be 2.5 times bigger
    model.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true; // Ensure material updates for better quality
        child.material.roughness = 0.5; // Adjust roughness for better appearance
        child.material.metalness = 0.5; // Adjust metalness for better appearance
      }
    });
    scene.add(model);

    mixer = new AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.timeScale = 0.5; // Slow down the animation speed by half (2x slower)
      action.play();
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.01);
  renderer.render(scene, camera);
}
animate();
