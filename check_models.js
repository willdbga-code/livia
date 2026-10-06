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

server.listen(8101, '127.0.0.1', () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tmpDir = path.join(process.cwd(), '.chrome_tmp_box');
  fs.mkdirSync(tmpDir, { recursive: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    '--no-default-browser-check',
    'http://127.0.0.1:8101/index.html'
  ]);

  setTimeout(async () => {
    try {
      const res = await fetch('http://127.0.0.1:9230/json');
      const tabs = await res.json();
      const tab = tabs.find(t => t.url.includes('8101'));
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      let id = 1;
      const send = (method, params = {}) => new Promise(resolve => {
        const cur = id++;
        const h = e => {
          const m = JSON.parse(e.data);
          if (m.id === cur) { ws.removeEventListener('message', h); resolve(m.result); }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: cur, method, params }));
      });

      ws.onopen = async () => {
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 2000));

        // Evaluate bounding boxes for each model by calling switch
        const models = ['diamond', 'hand', 'claw', 'polish', 'studio'];
        for (const m of models) {
          await send('Runtime.evaluate', {
            expression: `document.querySelector('.model-btn[data-model="${m}"]')?.click();`
          });
          await new Promise(r => setTimeout(r, 1200));

          const boxInfo = await send('Runtime.evaluate', {
            expression: `(() => {
              // Access scene through renderer or stageCanvas
              // We can inspect the stageModelGroup if exposed or find Three meshes
              return {
                modelKey: '${m}',
                hudText: document.getElementById('hudModelName')?.textContent,
                polyText: document.getElementById('hudPolyCount')?.textContent
              };
            })()`,
            returnByValue: true
          });
          console.log('Model check:', boxInfo.result?.value);
        }

        chrome.kill();
        server.close();
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e){}
        process.exit(0);
      };
    } catch(e) {
      console.error(e);
      chrome.kill();
      server.close();
      process.exit(1);
    }
  }, 1500);
});
