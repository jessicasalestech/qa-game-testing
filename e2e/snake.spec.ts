import { test, expect } from '@playwright/test';
import { SnakePage } from './pages/SnakePage';

test.describe('Jogo Snake — QA E2E', () => {
  test('novo jogo começa com placar 0 e a cobra no centro', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    const s = await game.state();
    expect(s.status).toBe('playing');
    expect(s.score).toBe(0);
    expect(s.snake).toEqual([{ x: 5, y: 5 }]);
    expect(await game.scoreValue()).toBe(0);
  });

  test('a cobra se move na direção das setas', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    await game.move('ArrowRight');
    expect((await game.state()).snake.at(-1)).toEqual({ x: 6, y: 5 });

    await game.move('ArrowDown');
    expect((await game.state()).snake.at(-1)).toEqual({ x: 6, y: 6 });
  });

  test('não permite inverter a direção (180°)', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    await game.move('ArrowLeft'); // deve ser ignorado (cobra indo para a direita)

    const s = await game.state();
    expect(s.direction).toEqual({ x: 1, y: 0 });
    expect(s.snake.at(-1)).toEqual({ x: 6, y: 5 });
  });

  test('termina o jogo quando a cobra bate na parede', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    // do centro (x=5) até a borda direita (x=9) + tentativa de sair = 5 movimentos
    for (let i = 0; i < 5; i++) await game.move('ArrowRight');

    await expect(game.gameOver).toBeVisible();
    expect((await game.state()).status).toBe('gameover');
  });

  test('ao comer o alimento, a cobra cresce e o placar sobe', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open(true); // modo de teste expõe os test hooks

    await game.setTestState({
      w: 10, h: 10,
      snake: [{ x: 5, y: 5 }],
      direction: { x: 1, y: 0 },
      food: { x: 6, y: 5 },
      score: 0,
      status: 'playing',
    });

    await game.move('ArrowRight');
    expect(await game.scoreValue()).toBe(1);
    const s = await game.state();
    expect(s.snake).toHaveLength(2);
  });
});