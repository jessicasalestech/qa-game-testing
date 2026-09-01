/**
 * Pure Snake game logic (no DOM) — unit-testable and used by the front-end.
 * Functions return a new state (immutable).
 * Dual exposure: CommonJS (Node/Jest) and global window.SnakeLogic (browser).
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.SnakeLogic = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  /** Creates a new game with the snake at the center (1 cell) and the 1st free food. */
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

  /** Picks the first free cell on the board (deterministic). null if full. */
  function pickFood(snake, w, h) {
    const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!occupied.has(`${x},${y}`)) return { x, y };
      }
    }
    return null;
  }

  /** Changes the direction, preventing immediate reversal (e.g., cannot go back). */
  function turn(state, dir) {
    if (dir.x + state.direction.x === 0 && dir.y + state.direction.y === 0) {
      return state; // reversal ignored
    }
    return { ...state, direction: { x: dir.x, y: dir.y } };
  }

  /** Advances one step. Handles collision, growth, and scoring. */
  function step(state) {
    if (state.status !== 'playing') return state;

    const head = state.snake[state.snake.length - 1];
    const nh = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    // Wall collision
    if (nh.x < 0 || nh.y < 0 || nh.x >= state.w || nh.y >= state.h) {
      return { ...state, status: 'gameover' };
    }

    const willGrow = state.food !== null && nh.x === state.food.x && nh.y === state.food.y;

    // Body to consider: if it does not grow, the tail leaves this round and does not collide
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