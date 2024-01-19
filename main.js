import * as THREE from 'three';
import {GLTFLoader} from "three/addons";
import SceneInit from "./public/SceneInit";

const test = new SceneInit('myThreeJsCanvas');
test.initialize();
test.animate();

const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();

// const boxGeometry = new THREE.BoxGeometry(8, 8, 8);
// const boxMaterial = new THREE.MeshNormalMaterial();
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// test.scene.add(boxMesh);

let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./public/scene.gltf', (gltfScene) => {
    loadedModel = gltfScene;
    console.log(loadedModel);

    gltfScene.scene.rotation.y = Math.PI / 8;
    gltfScene.scene.position.y = 3;
    gltfScene.scene.scale.set(10, 10, 10);

    const mixer = new THREE.AnimationMixer(gltfScene.scene);
    const animationActions = gltfScene.animations.map((clip) => mixer.clipAction(clip));
    animationActions.forEach((action) => action.play());
    loadedModel.mixer = mixer;
    test.scene.add(gltfScene.scene);
});

function animate() {

    requestAnimationFrame(animate);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const deltaTime = clock.getDelta();

    if (loadedModel && loadedModel.mixer) {
        loadedModel.mixer.update(deltaTime);
    }

    renderer?.render(test.scene, test.camera);
}

animate();


// const scene = new THREE.Scene();
//
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5;
//
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
//
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// console.log('adding cube')
//
// const newAnimate = () => {
//     requestAnimationFrame(newAnimate);
//
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//
//     renderer.render(scene, camera);
// };
//
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });
//
// newAnimate();
