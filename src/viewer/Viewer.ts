import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export interface ModelInfo {
    vertices: number;
    triangles: number;
    materials: number;
    width: number;
    height: number;
    depth: number;
}

export class Viewer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private loader: OBJLoader;

    private currentModel: THREE.Object3D | null = null;
    private grid: THREE.GridHelper;
    private axes: THREE.AxesHelper;

    constructor(container: HTMLElement) {

        // =========================
        // Scene
        // =========================

        this.scene = new THREE.Scene();

        this.scene.background =
            new THREE.Color(0x111111);


        // =========================
        // Camera
        // =========================

        this.camera =
            new THREE.PerspectiveCamera(
                60,
                container.clientWidth /
                container.clientHeight,
                0.1,
                1000
            );

        this.camera.position.set(
            3,
            3,
            3
        );


        // =========================
        // Renderer
        // =========================

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

        this.renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        container.appendChild(
            this.renderer.domElement
        );


        // =========================
        // Lighting
        // =========================

        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                2
            );

        this.scene.add(
            ambientLight
        );

        const directionalLight =
            new THREE.DirectionalLight(
                0xffffff,
                3
            );

        directionalLight.position.set(
            5,
            5,
            5
        );

        this.scene.add(
            directionalLight
        );


        // =========================
        // Grid
        // =========================

        this.grid =
            new THREE.GridHelper(
                20,
                20
            );

        this.scene.add(
            this.grid
        );

        //exes REGRESAAAA TMTT:(
        this.axes =
            new THREE.AxesHelper(10);

        this.axes.visible = false;

        this.scene.add(
            this.axes
        );

        // =========================
        // Controls
        // =========================

        this.controls =
            new OrbitControls(
                this.camera,
                this.renderer.domElement
            );

        this.controls.enableDamping = true;


        // =========================
        // OBJ Loader
        // =========================

        this.loader =
            new OBJLoader();


        // =========================
        // Resize
        // =========================

        window.addEventListener(
            'resize',
            () => {
                this.resize(
                    container.clientWidth,
                    container.clientHeight
                );
            }
        );


        // =========================
        // Start rendering
        // =========================

        this.animate();
    }


    // =========================
    // Resize
    // =========================

    private resize(
        width: number,
        height: number
    ) {
        this.camera.aspect =
            width / height;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            width,
            height
        );
    }


    // =========================
    // Load OBJ file
    // =========================

    public loadFile(
        file: File,
        onLoaded?: (info: ModelInfo) => void
    ) {

        const reader =
            new FileReader();

        reader.onload = () => {

            const contents =
                reader.result;

            if (
                typeof contents !==
                'string'
            ) {
                return;
            }


            // Remove previous model

            if (this.currentModel) {

                this.scene.remove(
                    this.currentModel
                );

                this.currentModel =
                    null;
            }


            // Parse OBJ

            const object =
                this.loader.parse(
                    contents
                );


            this.currentModel =
                object;

            this.scene.add(
                object
            );

            const info =
                this.getModelInfo(object);

            onLoaded?.(info);

            // Frame camera

            this.frameModel(
                object
            );
        };

        reader.readAsText(file);
    }


    // =========================
    // Grid
    // =========================

    public setGridVisible(
        visible: boolean
    ) {
        this.grid.visible =
            visible;
    }
    //once again exes, YA REGRESAAAAAAAAAAAA
    public setAxesVisible(
        visible: boolean
    ) {
        this.axes.visible =
            visible;
    }

    // =========================
    // Theme
    // =========================

    public setTheme(
        theme: 'dark' | 'light'
    ) {

        if (theme === 'dark') {

            this.scene.background =
                new THREE.Color(
                    0x111111
                );
        }

        if (theme === 'light') {

            this.scene.background =
                new THREE.Color(
                    0xf2f2f2
                );
        }
    }

    private getModelInfo(
        object: THREE.Object3D
    ): ModelInfo {

        let vertices = 0;
        let triangles = 0;
        let materials = 0;

        const materialSet =
            new Set<THREE.Material>();


        object.traverse(
            (child) => {

                if (
                    !(child instanceof THREE.Mesh)
                ) {
                    return;
                }

                const geometry =
                    child.geometry;

                const position =
                    geometry.getAttribute(
                        'position'
                    );

                if (position) {
                    vertices +=
                        position.count;
                }


                if (geometry.index) {

                    triangles +=
                        geometry.index.count / 3;

                } else if (position) {

                    triangles +=
                        position.count / 3;
                }


                const material =
                    child.material;

                if (Array.isArray(material)) {

                    material.forEach(
                        (mat) =>
                            materialSet.add(mat)
                    );

                } else {

                    materialSet.add(
                        material
                    );
                }
            }
        );


        const box =
            new THREE.Box3()
                .setFromObject(
                    object
                );

        const size =
            box.getSize(
                new THREE.Vector3()
            );


        materials =
            materialSet.size;


        return {
            vertices,
            triangles,
            materials,

            width: size.x,
            height: size.y,
            depth: size.z
        };
    }

    // =========================
    // Frame model
    // =========================

    private frameModel(
        object: THREE.Object3D
    ) {

        const box =
            new THREE.Box3()
                .setFromObject(
                    object
                );

        const center =
            box.getCenter(
                new THREE.Vector3()
            );

        const size =
            box.getSize(
                new THREE.Vector3()
            );

        const maxDimension =
            Math.max(
                size.x,
                size.y,
                size.z
            );


        // Center model

        object.position.sub(
            center
        );


        // Calculate camera distance

        const distance =
            maxDimension /
            (
                2 *
                Math.tan(
                    THREE.MathUtils.degToRad(
                        this.camera.fov
                    ) / 2
                )
            );


        this.camera.position.set(
            distance,
            distance,
            distance
        );


        this.camera.near =
            maxDimension / 1000;

        this.camera.far =
            maxDimension * 1000;

        this.camera.updateProjectionMatrix();


        // Orbit target

        this.controls.target.set(
            0,
            0,
            0
        );

        this.controls.update();
    }


    // =========================
    // Animation loop
    // =========================

    private animate() {

        requestAnimationFrame(
            () => this.animate()
        );

        this.controls.update();

        this.renderer.render(
            this.scene,
            this.camera
        );
    }

    public setWireframeVisible(
        visible: boolean
    ) {

        if (!this.currentModel) {
            return;
        }

        this.currentModel.traverse(
            (child) => {

                if (
                    !(child instanceof THREE.Mesh)
                ) {
                    return;
                }

                const material =
                    child.material;

                if (Array.isArray(material)) {

                    material.forEach(
                        (mat) => {
                            mat.wireframe =
                                visible;
                        }
                    );

                } else {

                    material.wireframe =
                        visible;
                }
            }
        );
    }
    
}