import * as THREE from "three";
import GUI from "lil-gui";

// Import shader files directly
import vertexShader from "./shaders/ocean.vert";
import fragmentShader from "./shaders/ocean.frag";

// init camera, scene, renderer
const scene: THREE.Scene = new THREE.Scene();
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
camera.position.z = 100;
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xc4c4c4);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();

// Define shader uniforms
const tuniform = {
  iGlobalTime: {
    type: "f",
    value: 0.1,
  },
  iResolution: {
    type: "v2",
    value: new THREE.Vector2(),
  },
  iMouse: {
    type: "v4",
    value: new THREE.Vector4(),
  },
  // Add ocean parameter uniforms
  SEA_HEIGHT: { type: "f", value: 0.6 },
  SEA_CHOPPY: { type: "f", value: 4.0 },
  SEA_SPEED: { type: "f", value: 0.8 },
  SEA_FREQ: { type: "f", value: 0.16 },
};

// Mouse position in - 1 to 1
renderer.domElement.addEventListener("mousedown", function (e: MouseEvent) {
  var canvas = renderer.domElement;
  var rect = canvas.getBoundingClientRect();
  tuniform.iMouse.value.x =
    ((e.clientX - rect.left) / window.innerWidth) * 2 - 1;
  tuniform.iMouse.value.y =
    ((e.clientY - rect.top) / window.innerHeight) * -2 + 1;
});
renderer.domElement.addEventListener("mouseup", function (e: MouseEvent) {
  var canvas = renderer.domElement;
  var rect = canvas.getBoundingClientRect();
  tuniform.iMouse.value.z =
    ((e.clientX - rect.left) / window.innerWidth) * 2 - 1;
  tuniform.iMouse.value.w =
    ((e.clientY - rect.top) / window.innerHeight) * -2 + 1;
});
// resize canvas function
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

tuniform.iResolution.value.x = window.innerWidth;
tuniform.iResolution.value.y = window.innerHeight;
// Create Plane
// Ocean parameters that can be controlled via GUI
const oceanParams = {
  seaHeight: 0.6,
  seaChoppy: 4.0,
  seaSpeed: 0.8,
  seaFreq: 0.16,
};

var material = new THREE.ShaderMaterial({
  uniforms: tuniform,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

// Create a more detailed plane geometry for better wireframe visualization
var mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 100, 100),
  material
);
scene.add(mesh);

// Setup GUI
const gui = new GUI({ title: "Ocean Controls" });

// Add ocean parameter controls with user-friendly names
gui
  .add(oceanParams, "seaHeight", 0.1, 2.0, 0.05)
  .name("Sea Height")
  .onChange((value: number) => {
    tuniform.SEA_HEIGHT.value = value;
  });

gui
  .add(oceanParams, "seaChoppy", 0.1, 8.0, 0.1)
  .name("Sea Choppiness")
  .onChange((value: number) => {
    tuniform.SEA_CHOPPY.value = value;
  });

gui
  .add(oceanParams, "seaSpeed", 0.1, 2.0, 0.05)
  .name("Sea Speed")
  .onChange((value: number) => {
    tuniform.SEA_SPEED.value = value;
  });

gui
  .add(oceanParams, "seaFreq", 0.02, 0.4, 0.02)
  .name("Sea Frequency")
  .onChange((value: number) => {
    tuniform.SEA_FREQ.value = value;
  });

// draw animation
function render() {
  tuniform.iGlobalTime.value += clock.getDelta();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
