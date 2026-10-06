/**
 * LÍVIA BARBOSA • THE GROOVY HIP-HOP SHOOT
 * Three.js 3D Viewport Controller:
 * 01. Hero Lil Uzi Diamond (Floating 3D Bling)
 * 02. Interactive 3D Chrome Hand Scroll Guide (Pointing Downward)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
function initAll() {
  initHeroDiamond();
  initScrollHand();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ==========================================================================
   01. HERO SECTION: FLOATING LIL UZI DIAMOND (Z-INDEX: 2 FULL-BLEED)
   ========================================================================== */
function initHeroDiamond() {
  const canvas = document.getElementById('heroDiamondCanvas');
  const container = document.getElementById('heroDiamondWrapper');
  if (!canvas || !container) return;

  const scene = new THREE.Scene();
  
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 420;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  // Orbit controls for hero diamond
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 2.2;
  controls.maxDistance = 6.0;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.0;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xd4af37, 2.5); // Warm Gold
  dirLight1.position.set(4, 5, 3);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xe2e8f0, 2.0); // Silver rim
  dirLight2.position.set(-4, -2, -3);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xfff1b8, 2.0, 10);
  pointLight.position.set(0, 1, 2);
  scene.add(pointLight);

  // Diamond Mesh Group
  const diamondGroup = new THREE.Group();
  scene.add(diamondGroup);

  // Build Hero Diamond Geometry
  const diamondMesh = createProceduralDiamond(0xd4af37);
  diamondGroup.add(diamondMesh);

  // Floating Golden Sparkles Particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 45;
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 5;
    posArray[i + 1] = (Math.random() - 0.5) * 5;
    posArray[i + 2] = (Math.random() - 0.5) * 5;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0xf7e7a9,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Parallax
  let mouseNormX = 0;
  let mouseNormY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    // Floating bobbing motion
    diamondGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

    // Slight parallax bias
    diamondGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1 + mouseNormY * 0.15;
    diamondGroup.rotation.z = Math.cos(elapsedTime * 0.6) * 0.1 + mouseNormX * 0.15;

    // Particles slow spin
    particleSystem.rotation.y = elapsedTime * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });
}

/* ==========================================================================
   02. SCROLL INVITE: INTERACTIVE 3D CHROME HAND (POINTING DOWNWARD)
   ========================================================================== */
function initScrollHand() {
  const canvas = document.getElementById('scrollHandCanvas');
  const container = document.getElementById('scrollHandContainer');
  if (!canvas || !container) return;

  const scene = new THREE.Scene();

  const width = container.clientWidth || 90;
  const height = container.clientHeight || 120;
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  // Studio Lights configured to accentuate liquid mirror chrome curves
  const hemiLight = new THREE.HemisphereLight(0xfff8e7, 0x1a243b, 1.4);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd4af37, 2.5); // Champagne gold
  fillLight.position.set(-3, 2, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xa0c8ff, 3.0); // Chrome blue specular
  rimLight.position.set(0, -3, 3);
  scene.add(rimLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 2.5);
  backLight.position.set(0, 3, -3);
  scene.add(backLight);

  // Point light for glowing chrome fingernails
  const tipGlow = new THREE.PointLight(0xfff4d0, 2.5, 6);
  tipGlow.position.set(0, -0.6, 1.5);
  scene.add(tipGlow);

  // Hand Group & Centered Wrapper
  const handGroup = new THREE.Group();
  scene.add(handGroup);

  const modelWrapper = new THREE.Group();
  handGroup.add(modelWrapper);

  // Liquid Chrome Material with maximum specular reflection & metallic presence
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xecf2fc,
    metalness: 0.90,
    roughness: 0.12,
    envMapIntensity: 2.2
  });

  // Gold Ring Accent Material
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.94,
    roughness: 0.12
  });

  // Micro stardust particles around the chrome fingertips
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 20;
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 2.2;
    posArray[i + 1] = -0.6 + (Math.random() - 0.5) * 1.5;
    posArray[i + 2] = (Math.random() - 0.5) * 2.0;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const handParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(handParticles);

  function mountHandModel(targetModel) {
    modelWrapper.clear();
    modelWrapper.add(targetModel);

    // Compute bounding box of targetModel
    const box = new THREE.Box3().setFromObject(targetModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetScale = 2.5 / maxDim;

    targetModel.scale.set(targetScale, targetScale, targetScale);
    targetModel.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);

    // ORIENTATION: Gracefully pointing DOWNWARDS towards the next section
    modelWrapper.rotation.z = Math.PI; // Flip vertically so stiletto claws point down
    modelWrapper.rotation.y = 0.35;    // Elegant 3/4 fashion profile
    modelWrapper.rotation.x = -0.15;   // Natural perspective inclination
  }

  // Attempt to load 038F Female Hand OBJ
  const objLoader = new OBJLoader();
  const path = encodeURI('assets/mão feminina/source/038F_05SET_04SHOT.OBJ');
  let isModelLoaded = false;

  objLoader.load(
    path,
    (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = chromeMaterial;
        }
      });
      mountHandModel(obj);
      isModelLoaded = true;
    },
    undefined,
    (err) => {
      console.warn('Fallback: Usando Mão Procedural em Cromo Líquido:', err);
      const procHand = createProceduralChromeHand(chromeMaterial, goldMaterial);
      mountHandModel(procHand);
      isModelLoaded = true;
    }
  );

  // Fallback timeout in case OBJ takes longer than 2.5s
  setTimeout(() => {
    if (!isModelLoaded && modelWrapper.children.length === 0) {
      const procHand = createProceduralChromeHand(chromeMaterial, goldMaterial);
      mountHandModel(procHand);
    }
  }, 2500);

  // Interactive Hover and Scroll Reaction
  let hoverOffset = 0;
  let targetHover = 0;
  const link = container.closest('a') || container;

  link.addEventListener('mouseenter', () => {
    targetHover = -0.25; // Hand gestures downwards when hovered
  });
  link.addEventListener('mouseleave', () => {
    targetHover = 0;
  });

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth hover transition
    hoverOffset += (targetHover - hoverOffset) * 0.1;

    // Organic levitation floating motion
    const bob = Math.sin(elapsedTime * 2.6) * 0.09;
    handGroup.position.y = bob + hoverOffset;

    // Fluid reactive tilt
    handGroup.rotation.y = 0.35 + Math.sin(elapsedTime * 1.4) * 0.08 + mouseX * 0.2;
    handGroup.rotation.x = -0.12 + Math.cos(elapsedTime * 1.6) * 0.06 - mouseY * 0.15;

    // Particle subtle rotation
    handParticles.rotation.y = elapsedTime * 0.08;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const w = container.clientWidth || 90;
    const h = container.clientHeight || 120;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* ==========================================================================
   03. PROCEDURAL GEOMETRY HELPERS
   ========================================================================== */

// 1. Procedural Lil Uzi Brilliant Cut Diamond
function createProceduralDiamond(colorHex = 0xd4af37) {
  const diamondGroup = new THREE.Group();

  // Crown (Top cone frustum)
  const crownGeo = new THREE.CylinderGeometry(0.85, 1.35, 0.45, 8, 1, false);
  const diamondMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    metalness: 0.2,
    roughness: 0.04,
    transmission: 0.88,
    thickness: 1.2,
    ior: 2.42, // Real diamond refractive index
    reflectivity: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02
  });
  const crown = new THREE.Mesh(crownGeo, diamondMat);
  crown.position.y = 0.22;
  diamondGroup.add(crown);

  // Pavilion (Bottom faceted cone pointing down)
  const pavilionGeo = new THREE.ConeGeometry(1.35, 1.45, 8, 1, false);
  const pavilion = new THREE.Mesh(pavilionGeo, diamondMat);
  pavilion.rotation.x = Math.PI;
  pavilion.position.y = -0.725;
  diamondGroup.add(pavilion);

  // Table (Flat top facet)
  const tableGeo = new THREE.CircleGeometry(0.85, 8);
  const tableMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.02,
    transmission: 0.95,
    ior: 2.42
  });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.rotation.x = -Math.PI / 2;
  table.position.y = 0.45;
  diamondGroup.add(table);

  // Iced Prongs (Hip-Hop Jewelry Setting)
  const prongGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
  const prongMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.98,
    roughness: 0.08
  });

  const prongCount = 8;
  const radius = 1.35;
  for (let i = 0; i < prongCount; i++) {
    const angle = (i / prongCount) * Math.PI * 2;
    const prong = new THREE.Mesh(prongGeo, prongMat);
    prong.position.set(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius);
    prong.rotation.z = (Math.cos(angle) > 0 ? -1 : 1) * 0.15;
    diamondGroup.add(prong);
  }

  diamondGroup.scale.set(1.15, 1.15, 1.15);
  return diamondGroup;
}

// 2. Procedural Sculpted Hand in Liquid Chrome with Stiletto Claws
function createProceduralChromeHand(chromeMat, goldMat) {
  const handGroup = new THREE.Group();

  const cMat = chromeMat || new THREE.MeshStandardMaterial({
    color: 0xf5f8ff,
    metalness: 0.98,
    roughness: 0.06
  });

  const gMat = goldMat || new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.1
  });

  // Palm
  const palmGeo = new THREE.BoxGeometry(0.85, 1.1, 0.25, 4, 4, 2);
  const palm = new THREE.Mesh(palmGeo, cMat);
  handGroup.add(palm);

  // Wrist
  const wristGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.7, 16);
  const wrist = new THREE.Mesh(wristGeo, cMat);
  wrist.position.y = -0.85;
  handGroup.add(wrist);

  // Chunky Golden Bracelet
  const bGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32);
  const bracelet = new THREE.Mesh(bGeo, gMat);
  bracelet.rotation.x = Math.PI / 2;
  bracelet.position.y = -0.75;
  handGroup.add(bracelet);

  // 4 Fingers + Thumb
  const fingerPositions = [
    { x: -0.32, y: 0.55, len: 0.7 },
    { x: -0.11, y: 0.62, len: 0.85 },
    { x: 0.11, y: 0.65, len: 0.88 },
    { x: 0.32, y: 0.55, len: 0.68 }
  ];

  fingerPositions.forEach((pos, idx) => {
    const fGeo = new THREE.CylinderGeometry(0.08, 0.09, pos.len, 12);
    const finger = new THREE.Mesh(fGeo, cMat);
    finger.position.set(pos.x, pos.y + pos.len / 2, 0);
    handGroup.add(finger);

    // Stiletto Claw at fingertip (Chrome Mirror Finish)
    const clawGeo = new THREE.ConeGeometry(0.08, 0.48, 12);
    const claw = new THREE.Mesh(clawGeo, cMat);
    claw.position.set(pos.x, pos.y + pos.len + 0.22, 0.04);
    claw.rotation.x = -0.22;
    handGroup.add(claw);

    // Chunky Groovy Ring on middle finger
    if (idx === 1 || idx === 2) {
      const ringGeo = new THREE.TorusGeometry(0.11, 0.035, 12, 24);
      const ring = new THREE.Mesh(ringGeo, gMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(pos.x, pos.y + 0.28, 0);
      handGroup.add(ring);
    }
  });

  // Thumb
  const thumbGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.6, 12);
  const thumb = new THREE.Mesh(thumbGeo, cMat);
  thumb.position.set(-0.48, 0.15, 0.08);
  thumb.rotation.z = 0.55;
  thumb.rotation.x = -0.25;
  handGroup.add(thumb);

  const thumbClawGeo = new THREE.ConeGeometry(0.085, 0.42, 12);
  const thumbClaw = new THREE.Mesh(thumbClawGeo, cMat);
  thumbClaw.position.set(-0.65, 0.42, 0.12);
  thumbClaw.rotation.z = 0.55;
  thumbClaw.rotation.x = -0.3;
  handGroup.add(thumbClaw);

  handGroup.scale.set(0.9, 0.9, 0.9);
  return handGroup;
}
