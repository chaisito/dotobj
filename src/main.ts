import './style.css';

import { Viewer } from './viewer/Viewer';
import type { ModelInfo } from './viewer/Viewer';

const app =
    document.querySelector<HTMLDivElement>(
        '#app'
    );

if (!app) {
    throw new Error(
        'Could not find #app'
    );
}


const viewer =
    new Viewer(app);


//yu ai

const gridToggle =
    document.querySelector<HTMLInputElement>(
        '#grid-toggle'
    );

const axesToggle =
    document.querySelector<HTMLInputElement>(
        '#axes-toggle'
    );

const wireframeToggle =
    document.querySelector<HTMLInputElement>(
        '#wireframe-toggle'
    );

const darkTheme =
    document.querySelector<HTMLButtonElement>(
        '#dark-theme'
    );

const lightTheme =
    document.querySelector<HTMLButtonElement>(
        '#light-theme'
    );

const modelInfo =
    document.querySelector<HTMLDivElement>(
        '#model-info'
    );


//km la cancion del ye, tekueme ye

gridToggle?.addEventListener(
    'change',
    () => {

        viewer.setGridVisible(
            gridToggle.checked
        );
    }
);

axesToggle?.addEventListener(
    'change',
    () => {

        viewer.setAxesVisible(
            axesToggle.checked
        );
    }
);

wireframeToggle?.addEventListener(
    'change',
    () => {

        viewer.setWireframeVisible(
            wireframeToggle.checked
        );
    }
);

// =========================
// Dark theme
// =========================

darkTheme?.addEventListener(
    'click',
    () => {

        viewer.setTheme(
            'dark'
        );

        darkTheme.classList.add(
            'active'
        );

        lightTheme?.classList.remove(
            'active'
        );
    }
);


//olivedelights

lightTheme?.addEventListener(
    'click',
    () => {

        viewer.setTheme(
            'light'
        );

        lightTheme.classList.add(
            'active'
        );

        darkTheme?.classList.remove(
            'active'
        );
    }
);


//el drag

let dragCounter = 0;


document.addEventListener(
    'dragenter',
    (event) => {

        event.preventDefault();

        dragCounter++;

        document.body.classList.add(
            'dragging'
        );
    }
);


document.addEventListener(
    'dragover',
    (event) => {

        event.preventDefault();
    }
);


document.addEventListener(
    'dragleave',
    (event) => {

        event.preventDefault();

        dragCounter--;

        if (dragCounter <= 0) {

            dragCounter = 0;

            document.body.classList.remove(
                'dragging'
            );
        }
    }
);


document.addEventListener(
    'drop',
    (event) => {

        event.preventDefault();

        dragCounter = 0;

        document.body.classList.remove(
            'dragging'
        );


        const file =
            event.dataTransfer?.files[0];

        if (!file) {
            return;
        }


        if (
            !file.name
                .toLowerCase()
                .endsWith('.obj')
        ) {

            console.warn(
                'Only OBJ files are currently supported.'
            );

            return;
        }


        // updatear el yu ai

        viewer.loadFile(
            file,
            (info) => {

                displayModelInfo(
                    file.name,
                    info
                );
            }
        );

        // lodear el modelo

        viewer.loadFile(file);

        //modelinfo
        function displayModelInfo(
            fileName: string,
            info: ModelInfo
        ) {

            if (!modelInfo) {
                return;
            }

            modelInfo.innerHTML = `
        <div class="model-name">
            ${fileName}
        </div>

        <div class="model-stat">
            <span>Vertices</span>
            <span>${info.vertices.toLocaleString()}</span>
        </div>

        <div class="model-stat">
            <span>Triangles</span>
            <span>${Math.round(info.triangles).toLocaleString()}</span>
        </div>

        <div class="model-stat">
            <span>Materials</span>
            <span>${info.materials}</span>
        </div>

        <div class="model-stat">
            <span>Dimensions</span>
            <span>
                ${formatDimension(info.width)} ×
                ${formatDimension(info.height)} ×
                ${formatDimension(info.depth)}
            </span>
        </div>
        `;
        }

        //dimensionesss
        function formatDimension(
            value: number
        ): string {

            if (value >= 100) {
                return value.toFixed(1);
            }

            if (value >= 10) {
                return value.toFixed(2);
            }

            return value.toFixed(3);
        }

    }
);