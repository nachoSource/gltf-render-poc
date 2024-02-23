import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer";

const setUpPlanets = (moon, scene) => {
    const EARTH_RADIUS = 2;
    const MOON_RADIUS = 0.5;
    const textureLoader = new THREE.TextureLoader();

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
    const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load("./public/textures/Boden_normal.png"),
        specularMap: textureLoader.load(
            "textures/planets/earth_specular_2048.jpg",
        ),
        normalMap: textureLoader.load(
            "./public/textures/body_metallicRoughness.png",
        ),
        normalScale: new THREE.Vector2(0.85, 0.85),
    });
    earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load("./public/textures/material_normal.png"),
    });
    moonMaterial.map.colorSpace = THREE.SRGBColorSpace;
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    //

    earth.layers.enableAll();
    moon.layers.enableAll();

    const earthDiv = document.createElement("div");
    earthDiv.className = "label";
    earthDiv.textContent = "Earth";
    earthDiv.style.backgroundColor = "transparent";

    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(1.5 * EARTH_RADIUS, 0, 0);
    earthLabel.center.set(0, 1);
    earth.add(earthLabel);
    earthLabel.layers.set(0);

    const earthMassDiv = document.createElement("div");
    earthMassDiv.className = "label";
    earthMassDiv.textContent = "5.97237e24 kg";
    earthMassDiv.style.backgroundColor = "transparent";

    const earthMassLabel = new CSS2DObject(earthMassDiv);
    earthMassLabel.position.set(1.5 * EARTH_RADIUS, 0, 0);
    earthMassLabel.center.set(0, 0);
    earth.add(earthMassLabel);
    earthMassLabel.layers.set(1);

    const moonDiv = document.createElement("div");
    moonDiv.className = "label";
    moonDiv.textContent = "Moon";
    moonDiv.style.backgroundColor = "transparent";

    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
    moonLabel.center.set(0, 1);
    moon.add(moonLabel);
    moonLabel.layers.set(0);

    const moonMassDiv = document.createElement("div");
    moonMassDiv.className = "label";
    moonMassDiv.textContent = "7.342e22 kg";
    moonMassDiv.style.backgroundColor = "transparent";

    const moonMassLabel = new CSS2DObject(moonMassDiv);
    moonMassLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
    moonMassLabel.center.set(0, 0);
    moon.add(moonMassLabel);
    moonMassLabel.layers.set(1);

    return moon;
};

export default setUpPlanets;
