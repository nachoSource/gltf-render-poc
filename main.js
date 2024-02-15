import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

// import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { AnimationMixer, Color } from "three";
import { GLTFLoader } from "three/addons";
import setUpPlanets from "./setUpPlanets";

// let gui;

let camera, scene, renderer, labelRenderer;

const clock = new THREE.Clock();

let moon;
let moonMesh;
let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./public/out_fuente/pcl.gltf", (gltfScene) => {
    loadedModel = gltfScene;
    console.log("loadedModel", gltfScene);

    const mixer = new AnimationMixer(gltfScene.scene);
    const animationActions = gltfScene.animations.map((clip) =>
        mixer.clipAction(clip),
    );
    animationActions.forEach((action) => action.play());
    loadedModel.mixer = mixer;
    scene.add(gltfScene.scene);
});

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const rayCaster = new THREE.Raycaster();

window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(
        planeNormal,
        new THREE.Vector3(0, 0, 0),
    );
    rayCaster.setFromCamera(mouse, camera);
    rayCaster.ray.intersectPlane(plane, intersectionPoint);
    // generate an intersection between a plane whose normal is camera.position (perp to screen)
    // and the point cloud
});

window.addEventListener("click", (e) => {
    // const sphereGeo = new THREE.SphereGeometry(1, 30, 30);
    // const sphereMat = new THREE.MeshStandardMaterial({
    //     color: 0xffea00,
    //     metalness: 0,
    //     roughness: 0,
    // });
    // const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    // scene.add(sphereMesh);
    // sphereMesh.position.copy(intersectionPoint);
    const p = document.createElement("p");
    p.textContent = "Hello";
    p.style.color = "black";
    const cPointlabel = new CSS2DObject(p);
    scene.add(cPointlabel);
    cPointlabel.position.copy(intersectionPoint);
});

init();

function init() {
    camera = new THREE.PerspectiveCamera(
        450,
        window.innerWidth / window.innerHeight,
        0.1,
        200,
    );
    camera.position.set(10, 5, 25);
    camera.layers.enableAll();

    scene = new THREE.Scene();
    scene.background = new Color("white");

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 0, 1);
    dirLight.layers.enableAll();
    scene.add(dirLight);

    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    moonMesh = setUpPlanets(moon, scene);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    // labelRenderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 100;

    //

    window.addEventListener("resize", () =>
        onWindowResize(camera, labelRenderer, renderer),
    );
    animate();
}

function animate() {
    stats.begin();
    requestAnimationFrame(animate);

    renderer.setSize(window.innerWidth, window.innerHeight);
    const deltaTime = clock.getDelta();
    if (loadedModel && loadedModel.mixer) {
        loadedModel.mixer.update(deltaTime);
    }

    const elapsed = clock.getElapsedTime();
    moonMesh.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

    // const intersects = rayCaster.intersectObjects(scene.children);
    // intersects.forEach((e) => {
    //     if (e.object.id === moonMesh.id) {
    //         console.log(e);
    //         e.object.material.color.set(0xff0000);
    //     }
    // });

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    stats.end();
}

function onWindowResize(camera, labelRenderer, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}
