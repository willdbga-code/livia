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
      res.writeHead(404);
      res.end('Not Found');
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

const PORT = 8105;
const CDP_PORT = 9235;

server.listen(PORT, '127.0.0.1', () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tmpDir = path.join(process.cwd(), '.chrome_tmp_snap');
  fs.mkdirSync(tmpDir, { recursive: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1440,1080',
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
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      let id = 1;

      function send(method, params = {}) {
        return new Promise(resolve => {
          const cur = id++;
          const h = e => {
            const m = JSON.parse(e.data);
            if (m.id === cur) { ws.removeEventListener('message', h); resolve(m.result); }
          };
          ws.addEventListener('message', h);
          ws.send(JSON.stringify({ id: cur, method, params }));
        });
      }

      ws.onopen = async () => {
        await send('Page.enable');
        // Wait for page to render and 3D loop to run
        await new Promise(r => setTimeout(r, 3500));

        // Take Hero Screenshot
        const heroSnap = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('hero_screenshot.png', Buffer.from(heroSnap.data, 'base64'));
        console.log('Saved hero_screenshot.png (size:', fs.statSync('hero_screenshot.png').size, 'bytes)');

        // Scroll to Manifesto
        await send('Runtime.evaluate', {
          expression: `document.getElementById('manifesto').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 1000));
        const manifestoSnap = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('manifesto_screenshot.png', Buffer.from(manifestoSnap.data, 'base64'));
        console.log('Saved manifesto_screenshot.png');

        // Scroll to Setups (9 Reference Photos)
        await send('Runtime.evaluate', {
          expression: `document.getElementById('setups').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 1200));
        const setupsSnap = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('setups_screenshot.png', Buffer.from(setupsSnap.data, 'base64'));
        console.log('Saved setups_screenshot.png');

        // Scroll to and capture close-up of the 3D chrome hand scroll invite
        await send('Runtime.evaluate', {
          expression: `document.getElementById('scrollHandContainer')?.scrollIntoView({ block: 'center' });`
        });
        await new Promise(r => setTimeout(r, 800));
        const handSnap = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('hand_scroll_screenshot.png', Buffer.from(handSnap.data, 'base64'));
        console.log('Saved hand_scroll_screenshot.png');

        // Scroll to tape deck
        await send('Runtime.evaluate', {
          expression: `document.getElementById('tape-deck').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 1000));

        const tapeSnap = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('tape_screenshot.png', Buffer.from(tapeSnap.data, 'base64'));
        console.log('Saved tape_screenshot.png (size:', fs.statSync('tape_screenshot.png').size, 'bytes)');

        chrome.kill();
        server.close();
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e){}
        process.exit(0);
      };
    } catch(err) {
      console.error(err);
      chrome.kill();
      server.close();
      process.exit(1);
    }
  }, 2000);
});
