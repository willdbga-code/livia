/**
 * LÍVIA BARBOSA • THE GROOVY HIP-HOP SHOOT
 * Main Interface, Lightbox, Web Audio Tape Deck & Checklist Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeaderAndMobileNav();
  initSetupsFilterAndLightbox();
  initGroovyTapeDeck();
  initProductionChecklist();
  initScrollParallax();
});

/* ==========================================================================
   01. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const label = document.getElementById('cursorLabel');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    if (label) {
      label.style.transform = `translate(${ringX}px, ${ringY + 32}px)`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover targets
  const interactiveTargets = document.querySelectorAll('a, button, .setup-card, .model-btn, .light-btn, .check-item, #scrollHandCanvas, #heroDiamondCanvas');
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active');
      if (label && el.dataset.cursorLabel) {
        label.textContent = el.dataset.cursorLabel;
        label.classList.add('visible');
      }
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active');
      if (label) {
        label.classList.remove('visible');
      }
    });
  });
}

/* ==========================================================================
   02. HEADER, MOBILE DRAWER & PRINT
   ========================================================================== */
function initHeaderAndMobileNav() {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const printBtn = document.getElementById('printDossierBtn');

  // Scroll detection
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // Print Dossier
  const printButtons = [document.getElementById('printDossierBtn'), document.getElementById('mobilePrintDossierBtn')].filter(Boolean);
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}

/* ==========================================================================
   03. SETUPS FILTER & FULLSCREEN LIGHTBOX MODAL
   ========================================================================== */
const shootPhotosData = [
  {
    setup: 'setup-1',
    badge: 'SETUP 01',
    title: 'The Block Queen: Graff & Atitude',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.45.jpeg',
    desc: 'Cenário com folhas grafitadas em preto fosco, cubo de estúdio branco, regata canelada cinza e jeans baggy com grafismos brancos. A modelo sentada exibe com naturalidade a mão no rosto e outra sobre as pernas.',
    light: 'Key Light suave 45° com softbox 90x90cm + fill frontal neutro para preservar o detalhe dos cabelos e grafites.',
    nails: 'Alongamento Stiletto Longo com base nude leitosa, nail art em bandana paisley azul royal e contornos cromados.',
    bling: 'Pulseiras duplas de prata maciça com nó infinito, anéis geométricos e solitário com gema safira.'
  },
  {
    setup: 'setup-1',
    badge: 'SETUP 01',
    title: 'Street Silhouette: 90s Beauty',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.45 (2).jpeg',
    desc: 'Enquadramento em plano fechado de 3/4. Tranças finas e longas com pontas em cachos abertos soltos, baby hairs milimetricamente desenhados na têmpora e camiseta oversized em camurça suede chumbo.',
    light: 'Beauty Dish prateado a 45° acima da linha dos olhos para criar pontos de brilho vivo nos lábios e maçãs do rosto.',
    nails: 'Alongamento em formato Stiletto com ponta fina e curva C impecável, tocando suavemente a gola da peça.',
    bling: 'Colar de pérolas naturais com entremeios de prata, bracelete torcido e anéis grossos de prata polida.'
  },
  {
    setup: 'setup-2',
    badge: 'SETUP 02',
    title: 'Cyber Purple Haze: Stiletto Flames',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.45 (1).jpeg',
    desc: 'Ciclorama infinito com gradiente magenta/roxo elétrico. Pose em agachamento potente do streetwear contemporâneo com mão apoiada sob o queixo exibindo garras stiletto com nervuras de cromo e chamas.',
    light: 'Dois refletores laterais gelatinados em roxo elétrico + luz de recorte superior fria (5600K) separando ombros e braços.',
    nails: 'Garra Stiletto XXL em preto laqueado com chamas cibernéticas em amarelo primário, estrelas e nervuras em cromo 3D.',
    bling: 'Argolas gigantes de prata, anéis de falange e tatuagens com estética cartoon 90s.'
  },
  {
    setup: 'setup-2',
    badge: 'SETUP 02',
    title: 'High-Key Peek-a-Boo: Framing Simétrico',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.44.jpeg',
    desc: 'Fundo branco estúdio (High-Key). Mãos cruzadas emoldurando os olhos em máscara geométrica. Alongamento formato Coffin/Bailarina com estampas de zebra rosa e flores esculturais em relevo acrílico 3D.',
    light: 'Octabox de 120cm frontal difuso para iluminação sem sombras duras, destacando o contorno dos olhos e o esmalte.',
    nails: 'Alongamento Coffin rosa translúcido com estampa animal print de zebra preta e flores 3D de alta textura.',
    bling: 'Mix de alianças cravejadas em quase todos os dedos, anel solitário com gema ônix e crucifixo gótico.'
  },
  {
    setup: 'setup-3',
    badge: 'SETUP 03',
    title: 'Liquid Silver Claws: O Espelho Vivo',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.44 (1).jpeg',
    desc: 'A fotografia mais emblemática de alta costura em unhas: mãos sobrepostas em perspectiva aberta contra fundo estourado em branco puro. As garras cromadas refletem a iluminação como espelhos líquidos perfeitos.',
    light: 'Fundo superexposto em +2 stops com luz de contraluz extrema criando recorte escultural e reflexos nas lâminas de cromo.',
    nails: 'Alongamento Stiletto Extremo com pó de cromo prata puro de espelhamento total (100% mirror finish).',
    bling: 'Anéis esculturais em metal líquido derretido com formato de teia orgânica e alianças de brilhantes.'
  },
  {
    setup: 'setup-4',
    badge: 'SETUP 04',
    title: 'Velvet Wine & Gold Royalty: Alta Realeza',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.44 (2).jpeg',
    desc: 'Fundo bordô bordeaux acetinado aveludado. Tranças finas e olhar lateral elegante. Unhas em esmaltação chocolate cacau decoradas com relevos orgânicos de ouro 18K derretido e esferas metálicas.',
    light: 'Luz quente de estúdio a 3200K com sombrinha refletora dourada para realçar os tons quentes da pele e o brilho do ouro.',
    nails: 'Unhas Coffin em tom chocolate quente com cordões esculturais em relevo 3D de ouro e studs esféricos.',
    bling: 'Anéis sinete curvos e orgânicos em ouro amarelo maciço polido e corrente delicada no colo.'
  },
  {
    setup: 'setup-4',
    badge: 'SETUP 04',
    title: 'Dark Low-Key: O Olhar Enigmático',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.43.jpeg',
    desc: 'Cenário escuro dramático onde apenas os olhos da modelo e as mãos cobrindo o terço inferior do rosto captam a iluminação direcional. Anéis dourados com pedras e anel clássico hip-hop com escrita personalizada.',
    light: 'Snoot fechado pontual incidindo exclusivamente nos olhos e nas mãos, deixando o restante do corpo em penumbra profunda.',
    nails: 'Alongamento Stiletto com mix de acabamentos: pedrarias preciosas, arabescos dourados e estampa tortoiseshell.',
    bling: 'Anel sinete oval de ouro, anel com relevo de hip-hop personalizado, anéis de falange e braceletes.'
  },
  {
    setup: 'setup-5',
    badge: 'SETUP 05',
    title: 'Cyber E-File: A Arma da Nail Artist',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.44 (4).jpeg',
    desc: 'O instrumento central da nail designer — o motor portátil e-file rosa com caneta micromotora — transformado em prop de atitude street como rádio comunicador. Mãos com francesinha bandana vermelha e pulseiras de ouro.',
    light: 'Luz de recorte lateral pontual iluminando o cabo espiral branco e o visor digital do equipamento contra o fundo preto.',
    nails: 'Alongamento clássico com francesinha decorada em estampa bandana vermelha e branca à mão livre.',
    bling: 'Mix de pulseiras de elos dourados, pulseira de placa e anéis entrelaçados.'
  },
  {
    setup: 'setup-5',
    badge: 'SETUP 05',
    title: 'The Swatch Fan: O Leque Couture',
    img: 'referencias/WhatsApp Image 2026-09-18 at 15.46.44 (3).jpeg',
    desc: 'O mostruário de tips e esmaltes empunhado como um leque de gueixa da alta moda cobrindo metade do rosto da modelo. Regata branca estruturada, corrente cubana dourada grossa com fecho T-bar e coração.',
    light: 'Softbox frontal difuso criando um degradê suave no colo, realçando a textura da pele e a transparência do leque.',
    nails: 'Leque com 30 tips em tons pastel e unhas naturais da modelo com esmaltação decorada em animal print e pontas vermelhas.',
    bling: 'Corrente de ouro amarelo pesado com fecho T-Bar e pingente de coração, relógio dourado tipo tanque.'
  }
];

function initSetupsFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.setup-card');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.setup === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Modal
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lbCloseBtn');
  const zoomBtn = document.getElementById('lbZoomToggle');
  const prevBtn = document.getElementById('lbPrevBtn');
  const nextBtn = document.getElementById('lbNextBtn');

  const lbBadge = document.getElementById('lbBadge');
  const lbTitle = document.getElementById('lbTitle');
  const lbImg = document.getElementById('lbImage');
  const lbDesc = document.getElementById('lbDesc');
  const lbLight = document.getElementById('lbLight');
  const lbNails = document.getElementById('lbNails');
  const lbBling = document.getElementById('lbBling');
  const lbCounter = document.getElementById('lbCounter');

  let currentPhotoIndex = 0;

  function openLightbox(index) {
    currentPhotoIndex = index;
    const data = shootPhotosData[currentPhotoIndex];
    if (!data) return;

    lbBadge.textContent = data.badge;
    lbTitle.textContent = data.title;
    lbImg.src = data.img;
    lbImg.alt = data.title;
    lbDesc.textContent = data.desc;
    lbLight.textContent = data.light;
    lbNails.textContent = data.nails;
    lbBling.textContent = data.bling;
    lbCounter.textContent = `${currentPhotoIndex + 1} / ${shootPhotosData.length}`;

    lbImg.classList.remove('zoomed');
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + shootPhotosData.length) % shootPhotosData.length;
    openLightbox(currentPhotoIndex);
  }

  // Card clicks
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

  if (zoomBtn && lbImg) {
    zoomBtn.addEventListener('click', () => {
      lbImg.classList.toggle('zoomed');
    });
    lbImg.addEventListener('click', () => {
      lbImg.classList.toggle('zoomed');
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (modal.hasAttribute('hidden')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

/* ==========================================================================
   04. GROOVY TAPE DECK (WEB AUDIO API PROCEDURAL BEAT SYNTHESIZER)
   ========================================================================== */
function initGroovyTapeDeck() {
  const cassetteCard = document.querySelector('.cassette-deck-card');
  const playBtn = document.getElementById('btnPlayBeat');
  const playBtnText = document.getElementById('playBtnText');
  const playIcon = document.getElementById('playIcon');
  const prevBtn = document.getElementById('btnPrevTrack');
  const nextBtn = document.getElementById('btnNextTrack');
  const trackSelect = document.getElementById('trackSelect');
  const tapeTrackTitle = document.getElementById('tapeTrackTitle');
  const volumeSlider = document.getElementById('volumeSlider');
  const headerAudioBtn = document.getElementById('headerAudioBtn');
  const visualizerCanvas = document.getElementById('audioVisualizerCanvas');

  let audioCtx = null;
  let masterGain = null;
  let analyser = null;
  let isPlaying = false;
  let beatTimer = null;
  let currentTrackIdx = 0;
  let currentStep = 0;

  const tracks = [
    { title: 'FAIXA 01: PINDA GOLDEN HOUR', bpm: 84, baseFreq: 110, style: 'lofi' },
    { title: 'FAIXA 02: LIQUID CHROME BOOM BAP', bpm: 92, baseFreq: 98, style: 'boombap' },
    { title: 'FAIXA 03: VELVET MAKTUB SOUL', bpm: 88, baseFreq: 123.47, style: 'soul' },
    { title: 'FAIXA 04: CYPHER STUDIO VIBE', bpm: 128, baseFreq: 82.41, style: 'trap' }
  ];

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(parseFloat(volumeSlider.value), audioCtx.currentTime);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      startVisualizerLoop();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesize Drum Hits
  function triggerKick(time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  function triggerSnare(time) {
    if (!audioCtx) return;
    // Tone
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.frequency.setValueAtTime(190, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.15);

    // Noise buffer
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.35, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(time);
    noise.stop(time + 0.15);
  }

  function triggerHiHat(time, open = false) {
    if (!audioCtx) return;
    const dur = open ? 0.22 : 0.05;
    const bufferSize = audioCtx.sampleRate * dur;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(open ? 0.2 : 0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + dur);
  }

  // Synthesize Groovy Chords & Bass
  const chordNotes = [
    [220, 261.63, 329.63, 392],    // Am7
    [174.61, 220, 261.63, 329.63], // Fmaj7
    [196, 246.94, 293.66, 349.23], // G7
    [164.81, 207.65, 246.94, 311.13] // E7
  ];

  function triggerChord(time, chordIdx) {
    if (!audioCtx) return;
    const notes = chordNotes[chordIdx % chordNotes.length];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const vol = 0.06 - (idx * 0.008);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + 0.85);
    });
  }

  function triggerBass(time, chordIdx) {
    if (!audioCtx) return;
    const rootNotes = [55, 43.65, 49, 41.2]; // A1, F1, G1, E1
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(rootNotes[chordIdx % rootNotes.length], time);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.65);
  }

  // Step Sequencer
  function stepBeat() {
    if (!isPlaying || !audioCtx) return;

    const track = tracks[currentTrackIdx];
    const now = audioCtx.currentTime;
    const barStep = currentStep % 16;
    const chordIdx = Math.floor(currentStep / 16) % 4;

    // Kick pattern: beats 0, 8, 10
    if (barStep === 0 || barStep === 7 || barStep === 10) {
      triggerKick(now);
    }

    // Snare pattern: beats 4, 12 (backbeat)
    if (barStep === 4 || barStep === 12) {
      triggerSnare(now);
    }

    // Hi-Hat pattern: 16ths
    if (barStep % 2 === 0) {
      triggerHiHat(now, barStep === 14);
    }

    // Chords on downbeats of bars
    if (barStep === 0) {
      triggerChord(now, chordIdx);
      triggerBass(now, chordIdx);
    } else if (barStep === 6) {
      triggerBass(now, chordIdx);
    }

    currentStep++;
    const stepInterval = (60 / track.bpm / 4) * 1000;
    beatTimer = setTimeout(stepBeat, stepInterval);
  }

  function startPlay() {
    initAudioContext();
    isPlaying = true;
    currentStep = 0;

    cassetteCard.classList.add('playing');
    headerAudioBtn.classList.add('playing');
    playBtnText.textContent = 'PAUSAR BEAT';
    playIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    stepBeat();
  }

  function pausePlay() {
    isPlaying = false;
    clearTimeout(beatTimer);

    cassetteCard.classList.remove('playing');
    headerAudioBtn.classList.remove('playing');
    playBtnText.textContent = 'INICIAR BEAT';
    playIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  }

  function togglePlay() {
    if (isPlaying) {
      pausePlay();
    } else {
      startPlay();
    }
  }

  function changeTrack(idx) {
    currentTrackIdx = (idx + tracks.length) % tracks.length;
    const track = tracks[currentTrackIdx];
    tapeTrackTitle.textContent = track.title;
    trackSelect.value = currentTrackIdx;

    if (isPlaying) {
      clearTimeout(beatTimer);
      currentStep = 0;
      stepBeat();
    }
  }

  // Event Listeners
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (headerAudioBtn) headerAudioBtn.addEventListener('click', togglePlay);

  if (prevBtn) prevBtn.addEventListener('click', () => changeTrack(currentTrackIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeTrack(currentTrackIdx + 1));

  if (trackSelect) {
    trackSelect.addEventListener('change', (e) => {
      changeTrack(parseInt(e.target.value, 10));
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
      }
    });
  }

  // Visualizer Animation Loop
  function startVisualizerLoop() {
    if (!visualizerCanvas) return;
    const ctx = visualizerCanvas.getContext('2d');
    const width = visualizerCanvas.width = visualizerCanvas.clientWidth;
    const height = visualizerCanvas.height = visualizerCanvas.clientHeight;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);

      if (!isPlaying) {
        // Idle ambient subtle wave
        ctx.fillStyle = '#060509';
        ctx.fillRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x += 10) {
          const y = height / 2 + Math.sin(x * 0.05 + Date.now() * 0.002) * 2;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(6, 5, 9, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#996515');
        gradient.addColorStop(0.6, '#d4af37');
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    }
    draw();
  }
}

/* ==========================================================================
   05. SHOOT DAY PRODUCTION CHECKLIST
   ========================================================================== */
function initProductionChecklist() {
  const checkItems = document.querySelectorAll('.check-item');
  const progressCircle = document.getElementById('progressCircle');
  const progressPercent = document.getElementById('progressPercent');
  const progressStatusText = document.getElementById('progressStatusText');
  const resetBtn = document.getElementById('btnResetChecklist');

  const STORAGE_KEY = 'livia_shoot_checklist_v1';

  // Load saved state
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    savedState = {};
  }

  checkItems.forEach(item => {
    const id = item.dataset.id;
    const input = item.querySelector('.check-input');

    if (savedState[id]) {
      input.checked = true;
    }

    input.addEventListener('change', () => {
      savedState[id] = input.checked;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      } catch (e) {}
      updateProgress();
    });
  });

  function updateProgress() {
    const total = checkItems.length;
    let checkedCount = 0;

    checkItems.forEach(item => {
      const input = item.querySelector('.check-input');
      if (input.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);

    if (progressPercent) progressPercent.textContent = `${percent}%`;
    if (progressCircle) {
      progressCircle.style.background = `conic-gradient(#d4af37 ${percent}%, rgba(255, 255, 255, 0.06) ${percent}%)`;
    }

    if (progressStatusText) {
      if (percent === 100) {
        progressStatusText.textContent = '🎉 TODOS OS ITENS CONFERIDOS! A produção está 100% pronta para o ensaio.';
      } else if (percent > 50) {
        progressStatusText.textContent = `Em andamento: ${checkedCount} de ${total} itens prontos. Quase lá!`;
      } else if (checkedCount > 0) {
        progressStatusText.textContent = `Iniciado: ${checkedCount} de ${total} itens organizados.`;
      } else {
        progressStatusText.textContent = 'Clique nos itens à direita conforme for organizando o material.';
      }
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      checkItems.forEach(item => {
        item.querySelector('.check-input').checked = false;
      });
      savedState = {};
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      updateProgress();
    });
  }

  updateProgress();
}

/* ==========================================================================
   06. SCROLL PARALLAX FOR DEPTH LAYERS & WATERMARKS
   ========================================================================== */
function initScrollParallax() {
  let ticking = false;
  const watermarks = document.querySelectorAll('.kinetic-watermark');
  const tiltedItems = document.querySelectorAll('.tilted-left, .tilted-right');

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Translate colossal background watermarks
        watermarks.forEach((wm, idx) => {
          const speed = (idx % 2 === 0) ? -0.1 : 0.08;
          wm.style.transform = `translate3d(${scrollY * speed}px, 0, 0)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
