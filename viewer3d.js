/**
 * LÍVIA BARBOSA • THE GROOVY HIP-HOP SHOOT
 * Three.js 3D Interactive Stage & Hero Diamond Viewport Controller
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeroDiamond();
  initInteractiveStage();
});

/* ==========================================================================
   01. HERO SECTION: FLOATING LIL UZI DIAMOND
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

  const pointLight = new THREE.PointLight(0xa855f7, 2.0, 10); // Purple glow
  pointLight.position.set(0, 3, 2);
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
   02. MAIN 3D INTERACTIVE STAGE & STUDIO LAB
   ========================================================================== */
function initInteractiveStage() {
  const canvas = document.getElementById('stageCanvas');
  const container = document.getElementById('stageCanvasCard');
  if (!canvas || !container) return;

  // Scene & Camera
  const scene = new THREE.Scene();

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 620;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0.8, 3.8);

  // WebGL Renderer with Alpha Transparency (No Bounding Box / Integrated WebGL)
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.minDistance = 1.2;
  controls.maxDistance = 8.0;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;

  // Floating ambient luminous aura ring (Open gallery installation)
  const ringGeo = new THREE.TorusGeometry(1.4, 0.015, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    transparent: true,
    opacity: 0.35
  });
  const glowRing = new THREE.Mesh(ringGeo, ringMat);
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = -1.1;
  scene.add(glowRing);

  // Studio Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xd4af37, 1.8);
  keyLight.position.set(3, 4, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xe2e8f0, 1.5);
  rimLight.position.set(-3, 2, -3);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xa855f7, 1.2, 8);
  fillLight.position.set(0, -1, 2);
  scene.add(fillLight);

  // Active Model Container
  const stageModelGroup = new THREE.Group();
  scene.add(stageModelGroup);

  // Model & Material State
  let currentModelKey = 'diamond';
  let currentMatKey = 'chrome';
  let currentLightKey = 'warm-gold';
  let currentIntensity = 1.2;

  // Model Caches & Loaders
  const objLoader = new OBJLoader();
  const colladaLoader = new ColladaLoader();
  const fbxLoader = new FBXLoader();

  const loadingOverlay = document.getElementById('stageLoading');
  const hudModelName = document.getElementById('hudModelName');
  const hudPolyCount = document.getElementById('hudPolyCount');
  const hudFps = document.getElementById('hudFps');
  const directorTipText = document.getElementById('directorTipText');

  // Director tips mapping
  const directorTips = {
    'warm-gold': '"Para o Setup 04 (Velvet & Gold), a luz quente a 3200K valoriza a profundidade do bordô e faz as nervuras de ouro 18K brilharem como joias de alta realeza."',
    'cyber-chrome': '"No Setup 03 (Liquid Silver Claws), a luz fria em contraluz cria a linha de contorno espelhada (rim light). Fundamental para destacar o acabamento 100% espelho das unhas."',
    'purple-haze': '"O ciclorama roxo elétrico do Setup 02 transmite a vibração do hip-hop contemporâneo. O contraste entre o neon violeta e o cromo das garras gera impacto imediato."',
    'dark-lowkey': '"O enquadramento Low-Key pontual concentra toda a atenção na expressão dos olhos e na precisão milimétrica das pedrarias das unhas."'
  };

  /* ------------------------------------------------------------------------
     Materials Palette
  ------------------------------------------------------------------------ */
  function getActiveMaterial() {
    switch (currentMatKey) {
      case 'gold':
        return new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.95,
          roughness: 0.15,
          envMapIntensity: 1.5
        });
      case 'ruby':
        return new THREE.MeshPhysicalMaterial({
          color: 0x8b1e32,
          roughness: 0.18,
          metalness: 0.1,
          transmission: 0.7,
          thickness: 1.2,
          ior: 1.5
        });
      case 'wireframe':
        return new THREE.MeshBasicMaterial({
          color: 0xd4af37,
          wireframe: true
        });
      case 'chrome':
      default:
        return new THREE.MeshStandardMaterial({
          color: 0xf1f5f9,
          metalness: 0.98,
          roughness: 0.08,
          envMapIntensity: 2.0
        });
    }
  }

  function applyMaterialToGroup(group) {
    const mat = getActiveMaterial();
    group.traverse((child) => {
      if (child.isMesh) {
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  function updateHUD(name, polyCount) {
    if (hudModelName) hudModelName.textContent = name.toUpperCase();
    if (hudPolyCount) hudPolyCount.textContent = `POLÍGONOS: ~${polyCount.toLocaleString()}`;
  }

  /* ------------------------------------------------------------------------
     Model Loader Functions
  ------------------------------------------------------------------------ */
  function loadModel(key) {
    currentModelKey = key;
    if (loadingOverlay) loadingOverlay.classList.add('visible');

    // Clear previous model
    while (stageModelGroup.children.length > 0) {
      const obj = stageModelGroup.children[0];
      stageModelGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    switch (key) {
      case 'diamond':
        loadDiamondModel();
        break;
      case 'hand':
        loadHandModel();
        break;
      case 'claw':
        loadClawModel();
        break;
      case 'polish':
        loadPolishModel();
        break;
      case 'studio':
        loadStudioModel();
        break;
      default:
        loadDiamondModel();
    }
  }

  // 1. Lil Uzi Diamond
  function loadDiamondModel() {
    const path = encodeURI('assets/diamante/source/Lil Uzi Diamond.fbx');
    fbxLoader.load(
      path,
      (fbx) => {
        fbx.scale.set(0.008, 0.008, 0.008);
        fbx.position.set(0, 0, 0);
        applyMaterialToGroup(fbx);
        stageModelGroup.add(fbx);
        updateHUD('Lil Uzi Diamond (FBX)', 1240);
        finishLoading();
      },
      undefined,
      (err) => {
        // Fallback procedural diamond
        console.warn('Carregando Diamante Procedural:', err);
        const proceduralDiamond = createProceduralDiamond();
        stageModelGroup.add(proceduralDiamond);
        applyMaterialToGroup(stageModelGroup);
        updateHUD('Lil Uzi Diamond (Couture 3D)', 960);
        finishLoading();
      }
    );
  }

  // 2. Mão Feminina Editorial
  function loadHandModel() {
    const path = encodeURI('assets/mão feminina/source/038F_05SET_04SHOT.OBJ');
    objLoader.load(
      path,
      (obj) => {
        obj.scale.set(0.09, 0.09, 0.09);
        obj.position.set(0, -0.7, 0);
        obj.rotation.x = -Math.PI / 6;
        applyMaterialToGroup(obj);
        stageModelGroup.add(obj);
        updateHUD('A Mão Editorial (038F OBJ)', 16500);
        finishLoading();
      },
      undefined,
      (err) => {
        // Fallback procedural hand with stiletto claws
        console.warn('Carregando Mão Procedural:', err);
        const hand = createProceduralHand();
        stageModelGroup.add(hand);
        applyMaterialToGroup(stageModelGroup);
        updateHUD('Mão Editorial & Garras Stiletto', 3420);
        finishLoading();
      }
    );
  }

  // 3. Garra Stiletto Chrome
  function loadClawModel() {
    const path = encodeURI('assets/unha de dinossauro/source/model/model.dae');
    colladaLoader.load(
      path,
      (collada) => {
        const dae = collada.scene;
        dae.scale.set(0.35, 0.35, 0.35);
        dae.position.set(0, -0.3, 0);
        applyMaterialToGroup(dae);
        stageModelGroup.add(dae);
        updateHUD('Garra Stiletto Chrome (DAE)', 2840);
        finishLoading();
      },
      undefined,
      (err) => {
        console.warn('Carregando Garra Procedural:', err);
        const claw = createProceduralClaw();
        stageModelGroup.add(claw);
        applyMaterialToGroup(stageModelGroup);
        updateHUD('Garra Stiletto Liquid Chrome', 1880);
        finishLoading();
      }
    );
  }

  // 4. Frasco de Esmalte Couture
  function loadPolishModel() {
    const path = encodeURI('assets/Vidro de esmalte/source/model/model.dae');
    colladaLoader.load(
      path,
      (collada) => {
        const dae = collada.scene;
        dae.scale.set(0.045, 0.045, 0.045);
        dae.position.set(0, -0.85, 0);
        applyMaterialToGroup(dae);
        stageModelGroup.add(dae);
        updateHUD('Frasco Esmalte Couture (DAE)', 3200);
        finishLoading();
      },
      undefined,
      (err) => {
        console.warn('Carregando Frasco Procedural:', err);
        const bottle = createProceduralPolishBottle();
        stageModelGroup.add(bottle);
        applyMaterialToGroup(stageModelGroup);
        updateHUD('Frasco Esmalte Haute Couture', 1450);
        finishLoading();
      }
    );
  }

  // 5. Cenário Nail Studio
  function loadStudioModel() {
    const path = encodeURI('assets/Cenario 1/source/model/model.dae');
    colladaLoader.load(
      path,
      (collada) => {
        const dae = collada.scene;
        dae.scale.set(0.45, 0.45, 0.45);
        dae.position.set(0, -0.95, 0);
        applyMaterialToGroup(dae);
        stageModelGroup.add(dae);
        updateHUD('Cenário Nail Studio (DAE)', 18900);
        finishLoading();
      },
      undefined,
      (err) => {
        console.warn('Carregando Cenário Procedural:', err);
        const studio = createProceduralStudio();
        stageModelGroup.add(studio);
        applyMaterialToGroup(stageModelGroup);
        updateHUD('Nail Studio & UV Lights', 4200);
        finishLoading();
      }
    );
  }

  function finishLoading() {
    if (loadingOverlay) {
      setTimeout(() => {
        loadingOverlay.classList.remove('visible');
      }, 250);
    }
  }

  /* ------------------------------------------------------------------------
     Lighting Presets
  ------------------------------------------------------------------------ */
  function applyLightingPreset(presetKey) {
    currentLightKey = presetKey;

    switch (presetKey) {
      case 'warm-gold':
        keyLight.color.setHex(0xffe17d);
        rimLight.color.setHex(0xd4af37);
        fillLight.color.setHex(0x5c1220);
        ringMat.color.setHex(0xd4af37);
        break;

      case 'cyber-chrome':
        keyLight.color.setHex(0xffffff);
        rimLight.color.setHex(0x94a3b8);
        fillLight.color.setHex(0x38bdf8);
        ringMat.color.setHex(0xe2e8f0);
        break;

      case 'purple-haze':
        keyLight.color.setHex(0xf43f5e);
        rimLight.color.setHex(0xa855f7);
        fillLight.color.setHex(0x6b21a8);
        ringMat.color.setHex(0xa855f7);
        break;

      case 'dark-lowkey':
        keyLight.color.setHex(0xffffff);
        rimLight.color.setHex(0x475569);
        fillLight.color.setHex(0x0f172a);
        ringMat.color.setHex(0x64748b);
        break;
    }

    keyLight.intensity = currentIntensity * 1.8;
    rimLight.intensity = currentIntensity * 1.4;
    fillLight.intensity = currentIntensity * 1.1;

    if (directorTipText && directorTips[presetKey]) {
      directorTipText.textContent = directorTips[presetKey];
    }
  }

  /* ------------------------------------------------------------------------
     UI Buttons & Listeners
  ------------------------------------------------------------------------ */
  // Model Buttons
  const modelBtns = document.querySelectorAll('.model-btn');
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadModel(btn.dataset.model);
    });
  });

  // Material Chips
  const matChips = document.querySelectorAll('.mat-chip');
  matChips.forEach(chip => {
    chip.addEventListener('click', () => {
      matChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentMatKey = chip.dataset.mat;
      applyMaterialToGroup(stageModelGroup);
    });
  });

  // Light Presets
  const lightBtns = document.querySelectorAll('.light-btn');
  lightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lightBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLightingPreset(btn.dataset.light);
    });
  });

  // Light Intensity Slider
  const lightSlider = document.getElementById('lightIntensitySlider');
  const lightVal = document.getElementById('lightIntensityVal');
  if (lightSlider) {
    lightSlider.addEventListener('input', (e) => {
      currentIntensity = parseFloat(e.target.value);
      if (lightVal) lightVal.textContent = `${currentIntensity.toFixed(1)}x`;
      applyLightingPreset(currentLightKey);
    });
  }

  // Viewport Controls
  const btnAutoRotate = document.getElementById('btnAutoRotate');
  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      btnAutoRotate.querySelector('.vp-text').textContent = controls.autoRotate ? 'AUTO-GIRAR: ON' : 'AUTO-GIRAR: OFF';
    });
  }

  const btnResetCamera = document.getElementById('btnResetCamera');
  if (btnResetCamera) {
    btnResetCamera.addEventListener('click', () => {
      camera.position.set(0, 1.2, 3.8);
      controls.target.set(0, 0, 0);
      controls.update();
    });
  }

  const btnFullscreen = document.getElementById('btnToggleFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // FPS Counter
  let frameCount = 0;
  let lastTime = performance.now();
  function updateFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      if (hudFps) hudFps.textContent = `${fps} FPS`;
      frameCount = 0;
      lastTime = now;
    }
  }

  // Stage Render Loop
  let stageClock = new THREE.Clock();
  function renderStage() {
    requestAnimationFrame(renderStage);
    const dt = stageClock.getDelta();

    controls.update();
    updateFps();

    // Model subtle float when not auto-rotating
    if (!controls.autoRotate && stageModelGroup) {
      stageModelGroup.position.y = Math.sin(stageClock.getElapsedTime() * 1.5) * 0.04;
    }

    renderer.render(scene, camera);
  }
  renderStage();

  // Resize handler
  function onStageResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onStageResize);
  document.addEventListener('fullscreenchange', () => {
    setTimeout(onStageResize, 100);
  });

  // Initial load
  loadModel('diamond');
  applyLightingPreset('warm-gold');
}

/* ==========================================================================
   PROCEDURAL 3D ASSET BUILDERS (HIGH FIDELITY FALLBACKS & PREVIEWS)
   ========================================================================== */

// 1. Procedural Lil Uzi Diamond
function createProceduralDiamond(color = 0xd4af37) {
  const diamondGroup = new THREE.Group();

  // Crown (upper cone)
  const crownGeo = new THREE.CylinderGeometry(1.2, 0.8, 0.6, 12, 1, false);
  const pavilionGeo = new THREE.ConeGeometry(1.2, 1.4, 12, 1, false);
  pavilionGeo.rotateX(Math.PI);
  pavilionGeo.translate(0, -0.7, 0);

  const mat = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.2,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 1.5,
    ior: 2.417,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08
  });

  const crown = new THREE.Mesh(crownGeo, mat);
  const pavilion = new THREE.Mesh(pavilionGeo, mat);

  diamondGroup.add(crown);
  diamondGroup.add(pavilion);
  diamondGroup.scale.set(0.9, 0.9, 0.9);

  return diamondGroup;
}

// 2. Procedural Hand with Stiletto Claws
function createProceduralHand() {
  const handGroup = new THREE.Group();

  // Palm
  const palmGeo = new THREE.BoxGeometry(0.85, 1.1, 0.25, 4, 4, 2);
  const palmMat = new THREE.MeshStandardMaterial({
    color: 0x93654e, // Warm Skin Tone
    roughness: 0.5,
    metalness: 0.1
  });
  const palm = new THREE.Mesh(palmGeo, palmMat);
  handGroup.add(palm);

  // Wrist
  const wristGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.7, 16);
  const wrist = new THREE.Mesh(wristGeo, palmMat);
  wrist.position.y = -0.85;
  handGroup.add(wrist);

  // Bracelet
  const bGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32);
  const bMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
  const bracelet = new THREE.Mesh(bGeo, bMat);
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
    const finger = new THREE.Mesh(fGeo, palmMat);
    finger.position.set(pos.x, pos.y + pos.len / 2, 0);
    handGroup.add(finger);

    // Stiletto Claw at tip
    const clawGeo = new THREE.ConeGeometry(0.08, 0.45, 12);
    const clawMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.06
    });
    const claw = new THREE.Mesh(clawGeo, clawMat);
    claw.position.set(pos.x, pos.y + pos.len + 0.2, 0.04);
    claw.rotation.x = -0.2;
    handGroup.add(claw);

    // Golden Ring on middle finger
    if (idx === 1) {
      const ringGeo = new THREE.TorusGeometry(0.11, 0.03, 12, 24);
      const ring = new THREE.Mesh(ringGeo, bMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(pos.x, pos.y + 0.25, 0);
      handGroup.add(ring);
    }
  });

  handGroup.scale.set(0.9, 0.9, 0.9);
  return handGroup;
}

// 3. Procedural Stiletto Claw
function createProceduralClaw() {
  const clawGroup = new THREE.Group();

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, -1.2, 0),
    new THREE.Vector3(0.5, 0.2, 0.4),
    new THREE.Vector3(0.1, 1.4, 0.8)
  );

  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.22, 16, false);
  const clawMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.98,
    roughness: 0.05
  });
  const tube = new THREE.Mesh(tubeGeo, clawMat);
  clawGroup.add(tube);

  // Sharp Tip
  const tipGeo = new THREE.ConeGeometry(0.12, 0.6, 16);
  const tip = new THREE.Mesh(tipGeo, clawMat);
  tip.position.set(0.1, 1.6, 0.8);
  tip.rotation.x = 0.4;
  clawGroup.add(tip);

  clawGroup.scale.set(1.1, 1.1, 1.1);
  return clawGroup;
}

// 4. Procedural Haute Couture Nail Polish Bottle
function createProceduralPolishBottle() {
  const bottleGroup = new THREE.Group();

  // Glass Body
  const bodyGeo = new THREE.BoxGeometry(1.0, 1.2, 1.0);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.08,
    transmission: 0.9,
    thickness: 0.8,
    ior: 1.52
  });
  const body = new THREE.Mesh(bodyGeo, glassMat);
  bottleGroup.add(body);

  // Liquid Inside
  const liquidGeo = new THREE.BoxGeometry(0.82, 0.95, 0.82);
  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0x8b1e32, // Bordeaux Nail Polish
    metalness: 0.4,
    roughness: 0.2
  });
  const liquid = new THREE.Mesh(liquidGeo, liquidMat);
  liquid.position.y = -0.08;
  bottleGroup.add(liquid);

  // Golden Ribbed Cap
  const capGeo = new THREE.CylinderGeometry(0.28, 0.3, 1.1, 24);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.15
  });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 1.1;
  bottleGroup.add(cap);

  bottleGroup.scale.set(0.9, 0.9, 0.9);
  return bottleGroup;
}

// 5. Procedural Studio Setup
function createProceduralStudio() {
  const studioGroup = new THREE.Group();

  // Base platform
  const baseGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.15, 32);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x181324, roughness: 0.4 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.8;
  studioGroup.add(base);

  // UV Ring Light Lamp
  const lampRingGeo = new THREE.TorusGeometry(0.9, 0.04, 16, 48);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
  const lampRing = new THREE.Mesh(lampRingGeo, lampMat);
  lampRing.position.set(0, 0.6, -0.6);
  studioGroup.add(lampRing);

  // Lamp Stand
  const standGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.4, 12);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, -0.1, -0.6);
  studioGroup.add(stand);

  return studioGroup;
}
