// import * as THREE from "three";
//
// const clock = new THREE.Clock();
//
// function animate(camera, labelRenderer, loadedModel, moon, renderer, scene) {
//     requestAnimationFrame(animate);
//
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     const deltaTime = clock.getDelta();
//     if (loadedModel && loadedModel.mixer) {
//         loadedModel.mixer.update(deltaTime);
//     }
//
//     const elapsed = clock.getElapsedTime();
//
//     moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
//
//     renderer.render(scene, camera);
//     labelRenderer.render(scene, camera);
// }
//
// export default animate;
