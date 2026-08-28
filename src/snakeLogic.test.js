const { createGame, turn, step, pickFood } = require('./snakeLogic');

describe('createGame', () => {
  it('cria a cobra no centro com uma célula', () => {
    const g = createGame(10, 10);
    expect(g.snake).toEqual([{ x: 5, y: 5 }]);
    expect(g.direction).toEqual({ x: 1, y: 0 });
    expect(g.score).toBe(0);
    expect(g.status).toBe('playing');
  });

  it('posiciona o alimento em célula livre (não sobre a cobra)', () => {
    const g = createGame(10, 10);
    expect(g.food).not.toBeNull();
    expect(g.snake.some((c) => c.x === g.food.x && c.y === g.food.y)).toBe(false);
  });
});

describe('pickFood', () => {
  it('retorna null quando o tabuleiro está cheio', () => {
    const snake = [];
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) snake.push({ x, y });
    expect(pickFood(snake, 2, 2)).toBeNull();
  });

  it('retorna a primeira célula livre na ordem de varredura', () => {
    expect(pickFood([{ x: 0, y: 0 }], 3, 3)).toEqual({ x: 1, y: 0 });
  });
});

describe('turn', () => {
  it('altera a direção', () => {
    const g = createGame(10, 10);
    const g2 = turn(g, { x: 0, y: -1 });
    expect(g2.direction).toEqual({ x: 0, y: -1 });
  });

  it('ignora inversão imediata de 180°', () => {
    const g = createGame(10, 10); // direita
    const g2 = turn(g, { x: -1, y: 0 }); // tentar ir para a esquerda
    expect(g2.direction).toEqual({ x: 1, y: 0 });
  });

  it('é imutável: não altera o estado original', () => {
    const g = createGame(10, 10);
    turn(g, { x: 0, y: -1 });
    expect(g.direction).toEqual({ x: 1, y: 0 });
  });
});

describe('step', () => {
  it('move a cabeça na direção atual', () => {
    const g = createGame(10, 10);
    const g2 = step(g);
    expect(g2.snake[g2.snake.length - 1]).toEqual({ x: 6, y: 5 });
    // sem comida, o tamanho da cobra se mantém
    expect(g2.snake).toHaveLength(1);
  });

  it('ao comer, cresce e pontua', () => {
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
    // novo alimento não fica sobre a cobra
    expect(g2.food).not.toBeNull();
    expect(g2.snake.some((c) => c.x === g2.food.x && c.y === g2.food.y)).toBe(false);
  });

  it('termina o jogo ao bater na parede', () => {
    const g = {
      w: 10, h: 10,
      snake: [{ x: 9, y: 5 }],
      direction: { x: 1, y: 0 },
      food: { x: 0, y: 0 },
      score: 0,
      status: 'playing',
    };
    const g2 = step(g); // nh.x = 10 (fora)
    expect(g2.status).toBe('gameover');
  });

  it('termina o jogo ao colidir com o próprio corpo', () => {
    // cobra em formato de L: cabeça em {1,2} subindo para {1,1} que já é corpo
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

  it('não faz nada quando o jogo já terminou', () => {
    const over = { ...createGame(5, 5), status: 'gameover' };
    expect(step(over)).toBe(over);
  });
});