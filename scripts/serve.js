const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

// Mapa de rota -> arquivo real (mantém a lógica em src/ e o jogo em public/)
const ROUTES = {
  '/': 'public/index.html',
  '/index.html': 'public/index.html',
  '/style.css': 'public/style.css',
  '/snake-game.js': 'public/snake-game.js',
  '/snakeLogic.js': 'src/snakeLogic.js',
};

const port = Number(process.env.PORT) || 4173;

const server = http.createServer((req, res) => {
  const rel = ROUTES[req.url.split('?')[0]] || null;
  if (!rel) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }
  fs.readFile(path.join(ROOT, rel), (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Error: ' + err.message);
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(rel)] || 'text/plain' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Snake QA running at http://localhost:${port}`);
});