import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export class Viewer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
}

constructor(container: HTMLElement) {
    this.scene = new THREE.scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );

    this.camera.position.set(3, 3, 3);

    this.renderer = new THREE.WebGLRenderer({
    antialias: true
    });

    this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    this.renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    container.appendChild(
        this.renderer.domElement
    );

    //ME CORTARON LA LUZ ASI COMO ME CORTO MI EX, CAMILA REGRESAAAAAAAAAAAAAA
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        2
    );

    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    directionalLight.position.set(5, 5, 5);

    this.scene.add(directionalLight);

    //PLACEHOLDER CUBOOOOO
    const geometry = new THREE.BoxGeometry(
        1,
        1,
        1
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x6699ff
    });

    const cube = new THREE.Mesh(
        geometry,
        material
    );

    this.scene.add(cube);

    this.controls = new OrbitControls(
        this.camera,
        this.renderer.domElement
    );

    this.controls.enableDamping = true;

    window.addEventListener('resize', () => {
        this.camera.aspect =
            window.innerWidth / window.innerHeight;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });
}

private animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    this.renderer.render(
        this.scene,
        this.camera
    );
}