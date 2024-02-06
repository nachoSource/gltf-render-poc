import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSG } from "./utils/CSGMesh";

const scene = new THREE.Scene();

const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf);

scene.add(gridHelper);

const light1 = new THREE.PointLight(0xffffff, 400);
light1.position.set(5, 10, 5);
scene.add(light1);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.5, 0);

const envTexture = new THREE.CubeTextureLoader().load([
    "img/px_25.jpg",
    "img/nx_25.jpg",
    "img/py_25.jpg",
    "img/ny_25.jpg",
    "img/pz_25.jpg",
    "img/nz_25.jpg",
]);
envTexture.mapping = THREE.CubeReflectionMapping;

const material = new THREE.MeshPhysicalMaterial({
    color: 0xb2ffc8,
    envMap: envTexture,
    metalness: 0.5,
    roughness: 0.1,
    transparent: true,
    opacity: 0.75,
    //transmission: .9,
    side: THREE.DoubleSide,
    flatShading: true,
});

const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 2),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }),
);
cubeMesh.position.set(-2, 1.5, -3);
scene.add(cubeMesh);

let modelsReady = false;
let cubeMonkeyMeshIntersect: THREE.Mesh;
let cubeMonkeyMeshSubtract: THREE.Mesh;
let cubeMonkeyMeshUnion: THREE.Mesh;

const loader = new GLTFLoader();
loader.load(
    "models/monkey.glb",
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                if ((child as THREE.Mesh).name === "Suzanne") {
                    const mesh = new THREE.Mesh(
                        (child as THREE.Mesh).geometry.clone(),
                        new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
                    );
                    mesh.position.set(2, 1.5, -3);
                    mesh.geometry.scale(1.15, 1.15, 1.15);
                    scene.add(mesh); //adding only the monkey mesh to the scene and ignoring everything else inside the gltf

                    const cubeCSG = CSG.fromGeometry(
                        cubeMesh.geometry.clone().translate(-0.5, 0, 0),
                    );
                    const monkeyMeshCSG = CSG.fromMesh(mesh);

                    const cubeMonkeyMeshIntersectCSG = cubeCSG.intersect(
                        monkeyMeshCSG.clone(),
                    );
                    cubeMonkeyMeshIntersect = CSG.toMesh(
                        cubeMonkeyMeshIntersectCSG,
                        new THREE.Matrix4(),
                    );
                    cubeMonkeyMeshIntersect.material = material;
                    cubeMonkeyMeshIntersect.position.set(-3, 1.5, 0);
                    scene.add(cubeMonkeyMeshIntersect);

                    const cubeMonkeyMeshSubtractCSG = cubeCSG.subtract(
                        monkeyMeshCSG.clone(),
                    );
                    cubeMonkeyMeshSubtract = CSG.toMesh(
                        cubeMonkeyMeshSubtractCSG,
                        new THREE.Matrix4(),
                    );
                    cubeMonkeyMeshSubtract.material = material;
                    cubeMonkeyMeshSubtract.position.set(0, 1.5, 0);
                    scene.add(cubeMonkeyMeshSubtract);

                    const cubeMonkeyMeshUnionCSG = cubeCSG.union(
                        monkeyMeshCSG.clone(),
                    );
                    cubeMonkeyMeshUnion = CSG.toMesh(
                        cubeMonkeyMeshUnionCSG,
                        new THREE.Matrix4(),
                    );
                    cubeMonkeyMeshUnion.material = material;
                    cubeMonkeyMeshUnion.position.set(3, 1.5, 0);
                    scene.add(cubeMonkeyMeshUnion);

                    modelsReady = true;
                }
            }
        });
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
        console.log(error);
    },
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    if (modelsReady) {
        cubeMonkeyMeshIntersect.rotation.y += 0.005;
        cubeMonkeyMeshSubtract.rotation.y += 0.005;
        cubeMonkeyMeshUnion.rotation.y += 0.005;
    }

    render();

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();
