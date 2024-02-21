import * as THREE from "three";
import { positionVarSlope } from "./data";

function freehandDrawAPlane(shape, color) {
    let planeMeshGeometry = new THREE.ShapeGeometry(shape);
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

function mouseTo3dWorld(camera, scene, event, canvas) {
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

function onMouseMove(camera, event, renderer, scene, uMap) {
    let drawPathLine = scene.getObjectByName("drawPath");
    if (drawPathLine) {
        scene.remove(drawPathLine);
    }

    if (uMap.freehand.isPressed) {
        let clicking_pos = mouseTo3dWorld(
            camera,
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

function onPointDown(control, event, uMap) {
    uMap.freehand.isPressed = true;
    uMap.freehand.drawToCollect.length = 0;
    control.enableRotate = false;
}

function onPointUp(camera, clusters, control, scene, uMap) {
    uMap.freehand.isPressed = false;
    control.enableRotate = true;

    let intersections = [];

    // TODO check how selection works and if anything else can be used for intersection
    if (uMap.freehand.drawToCollect.length > 3) {
        let umapRaycaster = new THREE.Raycaster();
        let selectionArea = scene.getObjectByName("drawPath");

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
                    cluster[j][2] * positionVarSlope,
                    cluster[j][3] * positionVarSlope,
                    cluster[j][4] * positionVarSlope,
                );

                ray.subVectors(dot, camera.position).normalize();
                umapRaycaster.ray.set(camera.position, ray);
                selectionArea.material.color.set("green");
                // debugger;
                let intersect = umapRaycaster.intersectObject(selectionArea);
                // TODO check why old points keep being used
                if (intersect.length > 0) {
                    selectedPoints++;
                    intersections.push(intersect);
                } // if
            } // for j
        } // for i
        console.log(selectedPoints + " points are selected");
        // console.log("Intersections:",intersections);
    }
}

export { onMouseMove, onPointDown, onPointUp };
