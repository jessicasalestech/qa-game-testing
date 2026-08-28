import { type Page, type Locator } from '@playwright/test';

export interface SnakeState {
  w: number;
  h: number;
  snake: Array<{ x: number; y: number }>;
  direction: { x: number; y: number };
  food: { x: number; y: number } | null;
  score: number;
  status: 'playing' | 'gameover';
}

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

/**
 * Page Object do jogo Snake.
 */
export class SnakePage {
  readonly score: Locator;
  readonly restartButton: Locator;
  readonly gameOver: Locator;

  constructor(readonly page: Page) {
    this.score = page.locator('#score');
    this.restartButton = page.locator('#restart');
    this.gameOver = page.locator('#game-over');
  }

  async open(testMode = false): Promise<void> {
    await this.page.goto(testMode ? '/?test' : '/');
  }

  /** Lê o estado atual do jogo (exposto via window.getGameState). */
  async state(): Promise<SnakeState> {
    return this.page.evaluate(() => (window as any).getGameState());
  }

  /** Define o estado do jogo (apenas em modo de teste/?test). */
  async setTestState(s: SnakeState): Promise<void> {
    await this.page.evaluate((x) => (window as any).__setTestState(x), s);
  }

  async move(key: ArrowKey): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async scoreValue(): Promise<number> {
    return Number(await this.score.textContent());
  }
}