/**
 * Lógica pura do jogo Snake (sem DOM) — testável unitariamente e usada pelo
 * front-end. Funções retornam novo estado (imutável).
 * Exposição dupla: CommonJS (Node/Jest) e global window.SnakeLogic (browser).
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.SnakeLogic = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  /** Cria um novo jogo com a cobra no centro (1 célula) e o 1º alimento livre. */
  function createGame(w, h) {
    w = w || 10;
    h = h || 10;
    const snake = [{ x: Math.floor(w / 2), y: Math.floor(h / 2) }];
    return {
      w,
      h,
      snake,
      direction: { x: 1, y: 0 },
      food: pickFood(snake, w, h),
      score: 0,
      status: 'playing',
    };
  }

  /** Escolhe a primeira célula livre no tabuleiro (determinístico). null se cheio. */
  function pickFood(snake, w, h) {
    const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!occupied.has(`${x},${y}`)) return { x, y };
      }
    }
    return null;
  }

  /** Altera a direção, impedindo inversão imediata (ex.: não pode ir para trás). */
  function turn(state, dir) {
    if (dir.x + state.direction.x === 0 && dir.y + state.direction.y === 0) {
      return state; // inversão ignorada
    }
    return { ...state, direction: { x: dir.x, y: dir.y } };
  }

  /** Avança um passo. Trata colisão, crescimento e pontuação. */
  function step(state) {
    if (state.status !== 'playing') return state;

    const head = state.snake[state.snake.length - 1];
    const nh = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    // Colisão com a parede
    if (nh.x < 0 || nh.y < 0 || nh.x >= state.w || nh.y >= state.h) {
      return { ...state, status: 'gameover' };
    }

    const willGrow = state.food !== null && nh.x === state.food.x && nh.y === state.food.y;

    // Corpo a considerar: se não cresce, a cauda sai nesta rodada e não colide
    const body = willGrow ? state.snake : state.snake.slice(0, -1);
    if (body.some((c) => c.x === nh.x && c.y === nh.y)) {
      return { ...state, status: 'gameover' };
    }

    const snake = [...state.snake, nh];

    if (willGrow) {
      const ns = { ...state, snake, score: state.score + 1 };
      return { ...ns, food: pickFood(snake, state.w, state.h) };
    }

    return { ...state, snake: snake.slice(1) };
  }

  return { createGame, turn, step, pickFood };
});