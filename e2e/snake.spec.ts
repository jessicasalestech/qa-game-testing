import { test, expect } from '@playwright/test';
import { SnakePage } from './pages/SnakePage';

test.describe('Snake game — QA E2E', () => {
  test('a new game starts with score 0 and the snake at the center', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    const s = await game.state();
    expect(s.status).toBe('playing');
    expect(s.score).toBe(0);
    expect(s.snake).toEqual([{ x: 5, y: 5 }]);
    expect(await game.scoreValue()).toBe(0);
  });

  test('the snake moves in the arrow key direction', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    await game.move('ArrowRight');
    expect((await game.state()).snake.at(-1)).toEqual({ x: 6, y: 5 });

    await game.move('ArrowDown');
    expect((await game.state()).snake.at(-1)).toEqual({ x: 6, y: 6 });
  });

  test('does not allow reversing direction (180°)', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    await game.move('ArrowLeft'); // should be ignored (snake moving right)

    const s = await game.state();
    expect(s.direction).toEqual({ x: 1, y: 0 });
    expect(s.snake.at(-1)).toEqual({ x: 6, y: 5 });
  });

  test('ends the game when the snake hits the wall', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open();

    // from the center (x=5) to the right edge (x=9) + attempt to leave = 5 moves
    for (let i = 0; i < 5; i++) await game.move('ArrowRight');

    await expect(game.gameOver).toBeVisible();
    expect((await game.state()).status).toBe('gameover');
  });

  test('when eating the food, the snake grows and the score increases', async ({ page }) => {
    const game = new SnakePage(page);
    await game.open(true); // test mode exposes the test hooks

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