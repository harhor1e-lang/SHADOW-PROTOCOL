import * as THREE from 'three';

const app = document.querySelector('#app');
const loading = document.querySelector('#loading');
const toast = document.querySelector('#toast');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bb7b4);
scene.fog = new THREE.FogExp2(0x9bb7b4, 0.012);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 500);
camera.position.set(23, 19, 29);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.domElement.id = 'world-canvas';
app.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdceeff, 0x536044, 2.0));
const sun = new THREE.DirectionalLight(0xffe2b5, 3.0);
sun.position.set(-35, 55, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -65;
sun.shadow.camera.right = 65;
sun.shadow.camera.top = 65;
sun.shadow.camera.bottom = -65;
scene.add(sun);

const groundGeo = new THREE.PlaneGeometry(180, 180, 90, 90);
groundGeo.rotateX(-Math.PI / 2);
const positions = groundGeo.attributes.position;
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  const z = positions.getZ(i);
  const hill = Math.sin(x * 0.075) * Math.cos(z * 0.06) * 1.5 + Math.sin((x + z) * 0.035) * 2.2;
  positions.setY(i, hill);
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x657d4d, roughness: 1 }));
ground.receiveShadow = true;
scene.add(ground);

const river = new THREE.Mesh(
  new THREE.PlaneGeometry(13, 190, 1, 40),
  new THREE.MeshStandardMaterial({ color: 0x397f91, roughness: 0.24, metalness: 0.12, transparent: true, opacity: 0.92 })
);
river.rotation.x = -Math.PI / 2;
river.position.set(-13, 0.18, 0);
river.receiveShadow = true;
scene.add(river);

function material(color, roughness = 0.9) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

function addTree(x, z, scale = 1) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.1, 7), material(0x60452d));
  trunk.position.y = 1.05;
  trunk.castShadow = true;
  group.add(trunk);
  const crown = new THREE.Mesh(new THREE.ConeGeometry(1.25, 3.4, 8), material(0x31583b));
  crown.position.y = 3.0;
  crown.castShadow = true;
  group.add(crown);
  group.position.set(x, 0, z);
  group.scale.setScalar(scale);
  scene.add(group);
}

function addHouse(x, z, scale = 1) {
  const group = new THREE.Group();
  const walls = new THREE.Mesh(new THREE.BoxGeometry(5, 3.1, 4.2), material(0xb69b70));
  walls.position.y = 1.55;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.8, 2.6, 4), material(0x594333));
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 4.2;
  roof.scale.set(1, 1, 0.82);
  roof.castShadow = true;
  group.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.8, 0.12), material(0x493326));
  door.position.set(0, 0.9, 2.16);
  group.add(door);
  group.position.set(x, 0, z);
  group.scale.setScalar(scale);
  scene.add(group);
}

for (let i = 0; i < 95; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 18 + Math.random() * 65;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  if (Math.abs(x + 13) < 9) continue;
  addTree(x, z, 0.65 + Math.random() * 0.75);
}

addHouse(7, 2, 1.0);
addHouse(15, -7, 0.78);
addHouse(3, -10, 0.7);

const path = new THREE.Mesh(new THREE.PlaneGeometry(5, 42), material(0x9a8866));
path.rotation.x = -Math.PI / 2;
path.position.set(10, 0.12, -15);
scene.add(path);

const keys = new Set();
addEventListener('keydown', (e) => keys.add(e.key.toLowerCase()));
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

let dragging = false;
let previous = { x: 0, y: 0 };
let yaw = Math.atan2(camera.position.x, camera.position.z);
let pitch = 0.35;
let distance = camera.position.length();
renderer.domElement.addEventListener('pointerdown', (e) => {
  dragging = true;
  previous = { x: e.clientX, y: e.clientY };
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointerup', () => dragging = false);
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  yaw -= (e.clientX - previous.x) * 0.005;
  pitch = THREE.MathUtils.clamp(pitch + (e.clientY - previous.y) * 0.004, -0.15, 1.05);
  previous = { x: e.clientX, y: e.clientY };
});
renderer.domElement.addEventListener('wheel', (e) => {
  distance = THREE.MathUtils.clamp(distance + e.deltaY * 0.035, 12, 85);
}, { passive: true });

const target = new THREE.Vector3(5, 0, 0);
document.querySelector('#enter-world').addEventListener('click', () => {
  toast.textContent = 'THE FRONTIER IS OPEN — explore the valley';
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2800);
});

let elapsed = 0;
let previousFrame = performance.now();
function animate(now = performance.now()) {
  requestAnimationFrame(animate);
  const delta = Math.min((now - previousFrame) / 1000, 1 / 30);
  previousFrame = now;
  elapsed += delta;
  const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0);
  const sideways = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
  target.x += (Math.sin(yaw) * forward + Math.cos(yaw) * sideways) * (7.2 * delta);
  target.z += (Math.cos(yaw) * forward - Math.sin(yaw) * sideways) * 0.12;
  camera.position.set(
    target.x + Math.sin(yaw) * Math.cos(pitch) * distance,
    target.y + Math.sin(pitch) * distance + 3,
    target.z + Math.cos(yaw) * Math.cos(pitch) * distance
  );
  camera.lookAt(target.x, target.y + 1, target.z);
  river.material.opacity = 0.88 + Math.sin(elapsed * 1.4) * 0.035;
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight);
});

setTimeout(() => loading.classList.add('hidden'), 900);
