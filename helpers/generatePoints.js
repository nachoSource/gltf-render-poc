import * as THREE from "three";
import { positionVarSlope, sizeVarSlope } from "./data";

function generatePoints(child, clusters, genes, scene, uMap) {
    try {
        let vertex = new THREE.Vector3();
        let bufferGeometries = new THREE.BufferGeometry();

        let counter = 0;
        let colorCount = 0;
        let materials = [];

        let totalPoint = uMap.data.length;
        let positions = new Float32Array(totalPoint * 3);
        let sizes = new Float32Array(totalPoint);
        let colors = new Float32Array(totalPoint * 3);

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
                vertex.x = cluster[j][2] * positionVarSlope;
                vertex.y = cluster[j][3] * positionVarSlope;
                vertex.z = cluster[j][4] * positionVarSlope;
                vertex.toArray(positions, counter * 3);

                sizes[counter] = sizeVarSlope;

                // TODO check how this works
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
                        // TODO use corresponding color or do not render at all
                        color: { value: new THREE.Color("rgb(0, 0, 0)") },
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

            // TODO check what should be done with genes
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
        // let umap_spot_cloud = new THREE.Points(child.geometry, child.material);

        umap_spot_cloud.name = "umap";
        scene.add(umap_spot_cloud);
        // scene.add(new THREE.Points(child.geometry, child.material));
    } catch (e) {
        console.info("generateUmap error");
        console.error(e.message);
    }
}

export default generatePoints;
