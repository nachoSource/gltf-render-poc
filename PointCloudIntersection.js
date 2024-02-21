// https://discourse.threejs.org/t/how-to-detect-if-the-points-intersect-to-the-plane/51119
// forked from: https://codepen.io/resolver_kunyao/pen/WNaXqJz

import * as THREE from "https://unpkg.com/three@0.112/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";

let scene;
let renderer;
let camera;
let control;

let genes = {
    three: {
        geometry: null,
        pointCloud: null,
    },
};

//data
let clusters = ["0", "1", "2", "3", "4", "5"];
clusters.info = [
    { key: 0 },
    { key: 1 },
    { key: 2 },
    { key: 3 },
    { key: 4 },
    { key: 5 },
];
clusters.colors = [
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
];

let uMap = {
    data: [
        // what are these???
        ["PathAnnotationObject", "1", -3.1257, 4.7272, -0.186],
        ["PathAnnotationObject-1", "4", 1.0269, -5.9331, -2.3175],
        ["PathAnnotationObject-2", "0", -1.8704, -1.625, -1.6433],
        ["PathAnnotationObject-3", "1", -5.0804, 4.6063, -1.013],
        ["PathAnnotationObject-4", "0", -2.1649, -0.4213, -0.9036],
        ["PathAnnotationObject-5", "5", -1.0086, -0.7193, 1.8689],
        ["PathAnnotationObject-6", "3", -2.8361, -2.6476, -2.817],
        ["PathAnnotationObject-7", "2", 10.6051, 2.9349, 2.7612],
        ["PathAnnotationObject-8", "3", -2.6613, -2.6663, -2.4008],
        ["PathAnnotationObject-9", "2", 11.186, 2.7522, 2.8518],
        ["PathAnnotationObject-10", "4", 1.2125, -6.2019, -1.8345],
        ["PathAnnotationObject-11", "0", -2.1002, -0.1516, -2.2803],
        ["PathAnnotationObject-12", "0", -3.3519, -0.4269, 0.8243],
        ["PathAnnotationObject-13", "0", -2.8275, -0.5832, 0.0818],
        ["PathAnnotationObject-14", "3", -3.3693, -2.6208, -0.0084],
        ["PathAnnotationObject-15", "4", 1.24, -5.2667, -2.9399],
        ["PathAnnotationObject-16", "2", 10.7033, 2.8926, 2.8178],
        ["PathAnnotationObject-17", "3", -1.9289, -3.3423, -2.7235],
        ["PathAnnotationObject-18", "5", 0.9717, -0.349, 2.7788],
        ["PathAnnotationObject-19", "1", -4.2031, 3.7098, 0.6638],
        ["PathAnnotationObject-20", "3", -3.0024, -3.6863, -2.3065],
        ["PathAnnotationObject-21", "0", -2.6379, -0.1925, -1.6089],
        ["PathAnnotationObject-22", "3", -3.5559, -2.8438, -0.3558],
        ["PathAnnotationObject-23", "2", 10.8874, 3.3673, 2.0376],
        ["PathAnnotationObject-24", "1", -5.236, 4.467, -0.0792],
        ["PathAnnotationObject-25", "0", -1.1821, -0.7466, 1.5685],
        ["PathAnnotationObject-26", "2", 11.0499, 1.8555, 0.4002],
        ["PathAnnotationObject-27", "0", -3.3411, 0.3114, -0.4101],
        ["PathAnnotationObject-28", "4", 1.4043, -5.7144, -3.5564],
        ["PathAnnotationObject-29", "0", -2.7951, -0.1752, -1.2655],
        ["PathAnnotationObject-30", "2", 11.4318, 2.3538, 0.2881],
        ["PathAnnotationObject-31", "2", 10.9216, 3.1703, 2.7267],
        ["PathAnnotationObject-32", "4", 0.6597, -5.7021, -1.6606],
        ["PathAnnotationObject-33", "0", -4.7116, 2.34, 0.0659],
        ["PathAnnotationObject-34", "3", -3.2803, -2.0918, 0.3565],
        ["PathAnnotationObject-35", "0", -2.3462, -0.3153, -1.2413],
        ["PathAnnotationObject-36", "0", -0.8619, -1.1195, -1.4498],
        ["PathAnnotationObject-37", "3", -3.1098, -2.7459, -2.0622],
        ["PathAnnotationObject-38", "1", -4.6563, 4.4008, 0.2006],
        ["PathAnnotationObject-39", "2", 12.1292, 2.7512, 0.7861],
        ["PathAnnotationObject-40", "0", -1.2452, -0.2868, -1.2007],
        ["PathAnnotationObject-41", "5", 0.71, -0.2669, 2.6594],
        ["PathAnnotationObject-42", "1", -4.0193, 4.4758, 0.2113],
        ["PathAnnotationObject-43", "1", -4.7755, 2.7157, 0.2905],
        ["PathAnnotationObject-44", "3", -2.3586, -2.4856, -1.7618],
        ["PathAnnotationObject-45", "4", 1.2033, -6.304, -1.6319],
        ["PathAnnotationObject-46", "3", -3.2814, -2.7948, -0.4058],
        ["PathAnnotationObject-47", "0", -2.3862, 2.1199, -1.1751],
        ["PathAnnotationObject-48", "2", 11.6088, 2.5384, 2.4573],
        ["PathAnnotationObject-49", "3", -2.4997, -2.7807, -2.6015],
    ],
    freehand: {
        isPredded: false,
        drawToCollect: [],
        raycaster_shape: null,
    },
};

function init() {
    //////scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0009);

    let renderWidth =
        document.querySelector("#canvas").parentElement.offsetWidth - 10;
    let renderHeight =
        document.querySelector("#canvas").parentElement.offsetHeight;
    //////renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderWidth, renderHeight);
    renderer.setClearColor(0x000000, 2.0); // Background color configuration
    renderer.shadowMap.enable = true;

    //////camera
    let fov = 45; // Camera frustum far plane.
    let aspect_ratio = window.innerWidth / window.innerHeight; //Camera frustum aspect ratio.
    let near_plane = 0.0001;
    let far_plane = 100;

    camera = new THREE.PerspectiveCamera(
        fov,
        aspect_ratio,
        near_plane,
        far_plane,
    );
    camera.frustumCulled = true;
    camera.position.set(0, 0, -1.5);

    control = new OrbitControls(camera, renderer.domElement);

    document.querySelector("#canvas").appendChild(renderer.domElement);
}

function generatePoints() {
    try {
        let vertex = new THREE.Vector3();
        let bufferGeometries = new THREE.BufferGeometry();

        let counter = 0;
        let colorCount = 0;
        let materials = [];

        let totalPoint = 50;
        let positions = new Float32Array(totalPoint * 3);
        let sizes = new Float32Array(totalPoint);
        let colors = new Float32Array(totalPoint * 3);
        let threeColor;

        bufferGeometries.clearGroups();

        let umap = scene.getObjectByName("umap");
        if (umap) {
            scene.remove(umap);
        }

        for (let i = 0; i < clusters.length; i++) {
            let key = clusters.info[i].key;
            let cluster = uMap.data.filter((x) => x[1] === key.toString());
            if (cluster.length === 0) {
                continue;
            }

            for (let j = 0; j < cluster.length; j++) {
                vertex.x = cluster[j][2] / 10;
                vertex.y = cluster[j][3] / 10;
                vertex.z = cluster[j][4] / 10;
                vertex.toArray(positions, counter * 3);

                sizes[counter] = 5;

                for (let c = 0; c < 3; c++) {
                    colors[colorCount] = clusters.colors[i][c % 3];
                    colorCount++;
                }

                counter++;
            }

            materials.push(
                new THREE.ShaderMaterial({
                    transparent: true,
                    uniforms: {
                        color: { value: new THREE.Color("rgb(230, 222, 9)") },
                        alpha: { value: 1.0 },
                    },
                    vertexShader:
                        document.getElementById("vertexshader").textContent,
                    fragmentShader:
                        document.getElementById("fragmentshader").textContent,

                    blending: THREE.NormalBlending,
                    depthTest: true,
                    name: "",
                }),
            );

            genes.three.geometry = new THREE.BufferGeometry();
            genes.three.geometry.setAttribute(
                "color",
                new THREE.BufferAttribute(colors, 3),
            );
            genes.three.geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3),
            );
            genes.three.geometry.setAttribute(
                "size",
                new THREE.BufferAttribute(sizes, 1),
            );

            bufferGeometries.addGroup(
                counter - cluster.length,
                cluster.length,
                i,
            );
        }

        bufferGeometries.setAttribute(
            "color",
            new THREE.BufferAttribute(colors, 3),
        );
        bufferGeometries.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3),
        );
        bufferGeometries.setAttribute(
            "size",
            new THREE.BufferAttribute(sizes, 1),
        );

        let umap_spot_cloud = new THREE.Points(bufferGeometries, materials);
        umap_spot_cloud.name = "umap";
        scene.add(umap_spot_cloud);
    } catch (e) {
        console.info("generateUmap error");
        console.error(e.message);
    }
}

function render() {
    renderer.render(scene, camera);
}

function animation() {
    render();
    requestAnimationFrame(animation);
}

///Selection
function mouseTo3dWorld(scene, event, canvas) {
    let mouse = new THREE.Vector3();
    let clicking_pos = new THREE.Vector3();

    mouse.x =
        ((event.clientX - canvas.left) / (canvas.right - canvas.left)) * 2 - 1;
    mouse.y =
        -((event.clientY - canvas.top) / (canvas.bottom - canvas.top)) * 2 + 1;
    mouse.z = 0.005; // why??

    mouse.unproject(camera);
    mouse.sub(camera.position).normalize();
    let distance = -camera.position.z / mouse.z; // why?
    clicking_pos.copy(camera.position).add(mouse.multiplyScalar(distance));
    return clicking_pos;
}

function freehandDrawAPlane(shape, color) {
    let planeMeshGeometry = new THREE.ShapeBufferGeometry(shape); // TODO check if should be ShapeGeometry
    //let edges = new THREE.EdgesGeometry(planeMeshGeometry);
    let line = new THREE.Mesh(
        planeMeshGeometry,
        new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        }),
    );

    line.linewidth = 20;
    return line;
}

function onCanvasMouseMove(event) {
    let drawPathLine = scene.getObjectByName("drawPath");
    if (drawPathLine) {
        scene.remove(drawPathLine);
    }

    if (uMap.freehand.isPressed) {
        let clicking_pos = mouseTo3dWorld(
            scene,
            event,
            renderer.domElement.getBoundingClientRect(), // what is this???
        );

        //collecting points for draw path
        uMap.freehand.drawToCollect.push(clicking_pos);

        if (
            uMap.freehand.drawToCollect.length === 0 ||
            uMap.freehand.drawToCollect.length <= 2
        ) {
            return false;
        }

        uMap.freehand.raycaster_shape = new THREE.Shape(); // 2d shape for selection apparently
        uMap.freehand.raycaster_shape.autoClose = true;

        uMap.freehand.raycaster_shape.moveTo(
            uMap.freehand.drawToCollect[0].x,
            uMap.freehand.drawToCollect[0].y,
        );

        // ^..^ was i=0
        for (let i = 1; i < uMap.freehand.drawToCollect.length; i++) {
            uMap.freehand.raycaster_shape.lineTo(
                uMap.freehand.drawToCollect[i].x,
                uMap.freehand.drawToCollect[i].y,
            );
        }
        let raycaster_plane = freehandDrawAPlane(
            uMap.freehand.raycaster_shape,
            new THREE.Color("rgb(255, 0, 0)"),
        );

        raycaster_plane.name = "drawPath";
        raycaster_plane.position.z = 0.0088; // why ???
        scene.add(raycaster_plane);
    } else {
        let drawPathLine = scene.getObjectByName("drawPath");
        if (drawPathLine) {
            scene.remove(drawPathLine);
        }
    }
}

function onCanvasPointdown(event) {
    uMap.freehand.isPressed = true;
    uMap.freehand.drawToCollect.length = 0;
    control.enableRotate = false;
}

function onCanvasPointup() {
    uMap.freehand.isPressed = false;
    control.enableRotate = true;

    if (uMap.freehand.drawToCollect.length > 3) {
        //Testing raycaster
        let umapRaycaster = new THREE.Raycaster();
        let selectionArea = scene.getObjectByName("drawPath");
        let collection = [];

        let selectedPoints = 0;

        for (let i = 0; i < clusters.info.length; i++) {
            let key = clusters.info[i].key;
            let cluster = uMap.data.filter((x) => x[1] === key.toString());

            if (cluster.length === 0) {
                continue;
            }

            let ray = new THREE.Vector3();
            for (let j = 0; j < cluster.length; j++) {
                let dot = new THREE.Vector3(
                    cluster[j][2] / 10,
                    cluster[j][3] / 10,
                    cluster[j][4] / 10,
                );
                //       let distance = dot.distanceTo(camera.position);

                ray.subVectors(dot, camera.position).normalize();
                //umapRaycaster.ray.set(dot, ray);
                umapRaycaster.ray.set(camera.position, ray);
                selectionArea.material.color.set("green");
                let intersect = umapRaycaster.intersectObject(selectionArea);
                //        scene.add(new THREE.ArrowHelper(ray, dot, distance, 0xffffff));

                if (intersect.length > 0) {
                    selectedPoints++;
                } // if
            } // for j
        } // for i
        console.log(selectedPoints + " points are selected");
    }
}

///
///Execute
///
init();
animation();
generatePoints();

document
    .getElementById("canvas")
    .addEventListener("mousemove", onCanvasMouseMove);
// TODO check what do these do?
document
    .getElementById("canvas")
    .addEventListener("pointerdown", onCanvasPointdown);
document
    .getElementById("canvas")
    .addEventListener("pointerup", onCanvasPointup);
