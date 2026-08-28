(function () {
  const { createGame, turn, step } = window.SnakeLogic;
  const CELL = 30;
  let state = null;

  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const overEl = document.getElementById('game-over');

  function start() {
    state = createGame(10, 10);
    draw();
  }

  function draw() {
    const { w, h, snake, food, score } = state;
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grade
    ctx.strokeStyle = '#262a3a';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, h * CELL); ctx.stroke();
    }
    for (let y = 0; y <= h; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(w * CELL, y * CELL); ctx.stroke();
    }

    // alimento
    if (food) {
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    }

    // cobra
    snake.forEach((seg, i) => {
      const isHead = i === snake.length - 1;
      ctx.fillStyle = isHead ? '#2ecc71' : '#58d68d';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });

    scoreEl.textContent = String(score);
    overEl.classList.toggle('hidden', state.status !== 'gameover');
  }

  const KEYS = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  document.addEventListener('keydown', (e) => {
    const dir = KEYS[e.key];
    if (!dir) return;
    e.preventDefault();
    if (state.status === 'gameover') return;
    state = step(turn(state, dir));
    draw();
  });

  document.getElementById('restart').addEventListener('click', start);

  // --- API de leitura para os testes E2E ---
  window.getGameState = () => JSON.parse(JSON.stringify(state));

  // --- Test hooks (apenas ao abrir com ?test) ---
  // Permite configurar o estado para cenários determinísticos (ex.: comer alimento)
  if (new URLSearchParams(location.search).has('test')) {
    window.__setTestState = (s) => {
      state = s;
      draw();
    };
  }

  start();
})();