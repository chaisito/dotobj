<<<<<<< HEAD
import './style.css';
import { Viewer } from './viewer/Viewer';

const app = document.querySelector<HTMLDivElement>(
    '#app'
);
=======
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
>>>>>>> d16576df62aec1dcfd242998afdbdee3c6b80bb9

if (!app) {
    throw new Error('Could not find #app');
}

<<<<<<< HEAD
const viewer = new Viewer(app);
=======
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(3, 3, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

app.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

directionalLight.position.set(5, 5, 5);

scene.add(directionalLight);

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshStandardMaterial({
    color: 0x6699ff
});

const cube = new THREE.Mesh(
    geometry,
    material
);

scene.add(cube);

// Grid
const grid = new THREE.GridHelper(10, 10);

scene.add(grid);

// Axes
const axes = new THREE.AxesHelper(3);

scene.add(axes);

// Controls
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;

// Resize
window.addEventListener('resize', () => {
    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// Render loop
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();
>>>>>>> d16576df62aec1dcfd242998afdbdee3c6b80bb9
