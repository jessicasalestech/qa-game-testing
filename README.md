# 🎮 QA Game Testing — Snake

[![English](https://img.shields.io/badge/English-blue?style=plastic&logo=openbadges&logoColor=white)](README.md) [![Português](https://img.shields.io/badge/Portugu%C3%AAs-green?style=plastic&logo=openbadges&logoColor=white)](README-pt-BR.md)

A **QA portfolio project** focused on **game testing**, applied to a custom **Snake**
game built for automation. It demonstrates **two complementary levels of game testing**:

1. **Unit tests of the game logic** (Jest) — rules, collisions, scoring and boundaries.
2. **E2E tests of the game rendered in the browser** (Playwright) — real keyboard interaction.

> Building the target game inside the project guarantees a **100% deterministic** environment:
> no ads, no rate limiting, no network — ideal for a reliable green CI.

## 🧠 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  src/snakeLogic.js      Pure game logic (no DOM)            │
│                          - immutable, testable (Jest)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (dual exposure: CommonJS + window.SnakeLogic)
┌──────────────────────────────▼──────────────────────────────┐
│  public/  (index.html + snake-game.js)  Rendered game       │
│           - keyboard (arrows) → step(turn(state, dir))      │
│           - exposes window.getGameState()  for tests        │
└──────────────────────────────┬──────────────────────────────┘
                               │ served by scripts/serve.js (local http)
┌──────────────────────────────▼──────────────────────────────┐
│  e2e/  (Playwright, Page Object)      Game E2E tests        │
│           - new game, movement, inversion, game over, eating│
└─────────────────────────────────────────────────────────────┘
```

**Test hooks** (`/?test`): the game exposes `window.__setTestState`, allowing a deterministic
initial state for scenarios (e.g. place the food right in front of the snake to validate the
score) — a common technique in game QA.

## ✅ What is covered

**Logic (Jest — 12 scenarios):** game creation, food placement, free-cell selection,
direction change, **180° no-inversion rule**, movement, growth and **scoring when eating**,
**game over by wall and by self-collision**, and post-game-over behaviour.

**E2E (Playwright — 5 scenarios):** new game (score 0 and snake centred), arrow-key movement,
**no direction inversion**, **game over on wall hit**, **score increases when eating**.

## 🚀 Stack

- **Jest** — unit tests of the game logic (≥ 90% coverage gated in CI)
- **Playwright** — game E2E in the browser (Chromium)
- **Node** — local static server (`scripts/serve.js`) for the game
- **GitHub Actions** — runs logic + E2E and publishes report/screenshots

## ▶️ Getting started

```bash
npm install
npm run install:browsers   # or: npx playwright install chromium

npm run test:unit          # game-logic unit tests (Jest)
npm run test:e2e           # game E2E tests in the browser (Playwright)
npm test                   # everything
```

To play manually: `node scripts/serve.js` and open `http://localhost:4173`.

## 🕹️ Why test the logic separately from the DOM?

The pure logic (collision, growth, score) is where the game rules live — and where QA
finds **off-by-one and boundary bugs**. Separating it lets you test it quickly and
deterministically, without drawing/rendering. The E2E tests then guarantee that the **real game**
behaves the way the logic predicts.

---

**Author:** Jessica Sales · QA