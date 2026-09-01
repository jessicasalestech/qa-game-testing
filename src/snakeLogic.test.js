const { createGame, turn, step, pickFood } = require('./snakeLogic');

describe('createGame', () => {
  it('creates the snake centered with one cell', () => {
    const g = createGame(10, 10);
    expect(g.snake).toEqual([{ x: 5, y: 5 }]);
    expect(g.direction).toEqual({ x: 1, y: 0 });
    expect(g.score).toBe(0);
    expect(g.status).toBe('playing');
  });

  it('places the food on a free cell (not on top of the snake)', () => {
    const g = createGame(10, 10);
    expect(g.food).not.toBeNull();
    expect(g.snake.some((c) => c.x === g.food.x && c.y === g.food.y)).toBe(false);
  });
});

describe('pickFood', () => {
  it('returns null when the board is full', () => {
    const snake = [];
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) snake.push({ x, y });
    expect(pickFood(snake, 2, 2)).toBeNull();
  });

  it('returns the first free cell in scan order', () => {
    expect(pickFood([{ x: 0, y: 0 }], 3, 3)).toEqual({ x: 1, y: 0 });
  });
});

describe('turn', () => {
  it('changes the direction', () => {
    const g = createGame(10, 10);
    const g2 = turn(g, { x: 0, y: -1 });
    expect(g2.direction).toEqual({ x: 0, y: -1 });
  });

  it('ignores an immediate 180° reversal', () => {
    const g = createGame(10, 10); // right
    const g2 = turn(g, { x: -1, y: 0 }); // trying to go left
    expect(g2.direction).toEqual({ x: 1, y: 0 });
  });

  it('is immutable: does not mutate the original state', () => {
    const g = createGame(10, 10);
    turn(g, { x: 0, y: -1 });
    expect(g.direction).toEqual({ x: 1, y: 0 });
  });
});

describe('step', () => {
  it('moves the head in the current direction', () => {
    const g = createGame(10, 10);
    const g2 = step(g);
    expect(g2.snake[g2.snake.length - 1]).toEqual({ x: 6, y: 5 });
    // without food, the snake length stays the same
    expect(g2.snake).toHaveLength(1);
  });

  it('grows and scores when eating', () => {
    const g = {
      w: 10, h: 10,
      snake: [{ x: 5, y: 5 }],
      direction: { x: 1, y: 0 },
      food: { x: 6, y: 5 },
      score: 0,
      status: 'playing',
    };
    const g2 = step(g);
    expect(g2.score).toBe(1);
    expect(g2.snake).toEqual([{ x: 5, y: 5 }, { x: 6, y: 5 }]);
    // new food does not sit on top of the snake
    expect(g2.food).not.toBeNull();
    expect(g2.snake.some((c) => c.x === g2.food.x && c.y === g2.food.y)).toBe(false);
  });

  it('ends the game when hitting the wall', () => {
    const g = {
      w: 10, h: 10,
      snake: [{ x: 9, y: 5 }],
      direction: { x: 1, y: 0 },
      food: { x: 0, y: 0 },
      score: 0,
      status: 'playing',
    };
    const g2 = step(g); // nh.x = 10 (out of bounds)
    expect(g2.status).toBe('gameover');
  });

  it('ends the game when colliding with its own body', () => {
    // L-shaped snake: head at {1,2} moving up to {1,1} which is already body
    const g = {
      w: 5, h: 5,
      snake: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }],
      direction: { x: 0, y: -1 },
      food: { x: 0, y: 4 },
      score: 0,
      status: 'playing',
    };
    const g2 = step(g);
    expect(g2.status).toBe('gameover');
  });

  it('does nothing when the game has already ended', () => {
    const over = { ...createGame(5, 5), status: 'gameover' };
    expect(step(over)).toBe(over);
  });
});