import './style.css';
import { Viewer } from './viewer/Viewer';

const app = document.querySelector<HTMLDivElement>(
    '#app'
);

if (!app) {
    throw new Error('Could not find #app');
}

const viewer = new Viewer(app);