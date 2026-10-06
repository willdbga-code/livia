const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.dae': 'application/xml',
  '.obj': 'text/plain',
  '.fbx': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), reqPath.replace(/^\//, ''));
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log('[404]', reqPath);
      res.writeHead(404);
      res.end('Not Found: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

const PORT = 8098;
const CDP_PORT = 9228;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tmpDir = path.join(process.cwd(), '.chrome_tmp_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    '--no-default-browser-check',
    `http://127.0.0.1:${PORT}/index.html`
  ]);

  setTimeout(async () => {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const tabs = await res.json();
      const tab = tabs.find(t => t.url.includes(`${PORT}`));
      if (!tab) {
        console.error('No tab found for port ' + PORT);
        return cleanUp();
      }

      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      let msgId = 1;

      function send(method, params = {}) {
        return new Promise((resolve) => {
          const currentId = msgId++;
          const handler = (e) => {
            const data = JSON.parse(e.data);
            if (data.id === currentId) {
              ws.removeEventListener('message', handler);
              resolve(data.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id: currentId, method, params }));
        });
      }

      ws.onopen = async () => {
        ws.addEventListener('message', (e) => {
          const data = JSON.parse(e.data);
          if (data.method === 'Runtime.consoleAPICalled') {
            console.log('[BROWSER LOG]', data.params.type, data.params.args.map(a => a.value ?? a.description).join(' '));
          } else if (data.method === 'Runtime.exceptionThrown') {
            console.error('[BROWSER EXCEPTION]', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
          }
        });

        await send('Runtime.enable');
        await send('Page.enable');

        // Test basic DOM
        const domTest = await send('Runtime.evaluate', {
          expression: `({
            title: document.title,
            heroDiamondRemoved: !document.getElementById('heroDiamondCanvas'),
            scrollHandCanvas: !!document.getElementById('scrollHandCanvas'),
            nonNominativeScrollBadge: document.querySelector('.scroll-hand-badge')?.textContent === '[ SCROLL DOWN ]',
            cardsCount: document.querySelectorAll('.setup-card').length,
            checklistCount: document.querySelectorAll('.check-item').length
          })`,
          returnByValue: true
        });
        console.log('DOM Test Results:', domTest.result?.value);

        // Wait 3.5 seconds for 3D engine and textures to initialize
        await new Promise(r => setTimeout(r, 3500));

        // Test 3D Scroll Hand Canvas
        console.log('--- Testing 3D Scroll Hand Canvas ---');
        const canvasTest = await send('Runtime.evaluate', {
          expression: `({
            scrollHandWidth: document.getElementById('scrollHandCanvas')?.width,
            scrollHandHeight: document.getElementById('scrollHandCanvas')?.height,
            scrollInviteHref: document.querySelector('.scroll-hand-link')?.getAttribute('href')
          })`,
          returnByValue: true
        });
        console.log('3D Canvases Check:', canvasTest.result?.value);

        // Test Tape Deck Play / Pause
        console.log('--- Testing Tape Deck Web Audio ---');
        const playRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = document.getElementById('btnPlayBeat');
            btn?.click();
            return {
              isPlaying: document.querySelector('.cassette-deck-card')?.classList.contains('playing'),
              btnText: document.getElementById('playBtnText')?.textContent
            };
          })()`,
          returnByValue: true
        });
        console.log('Play button clicked:', playRes.result?.value);

        // Test Lightbox
        console.log('--- Testing Lightbox Modal ---');
        const lbRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const firstCard = document.querySelector('.setup-card');
            firstCard?.click();
            const modal = document.getElementById('lightboxModal');
            return {
              modalVisible: !modal?.hasAttribute('hidden'),
              title: document.getElementById('lbTitle')?.textContent,
              badge: document.getElementById('lbBadge')?.textContent,
              imgSrc: document.getElementById('lbImage')?.src
            };
          })()`,
          returnByValue: true
        });
        console.log('Lightbox opened:', lbRes.result?.value);

        // Test Checklist
        console.log('--- Testing Checklist Interaction ---');
        const checkRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const firstInput = document.querySelector('.check-item .check-input');
            firstInput.checked = true;
            firstInput.dispatchEvent(new Event('change'));
            return {
              percent: document.getElementById('progressPercent')?.textContent,
              status: document.getElementById('progressStatusText')?.textContent
            };
          })()`,
          returnByValue: true
        });
        console.log('Checklist updated:', checkRes.result?.value);

        cleanUp();
      };
    } catch(err) {
      console.error('Test error:', err);
      cleanUp();
    }
  }, 2000);

  function cleanUp() {
    chrome.kill();
    server.close();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e){}
    process.exit(0);
  }
});
