# 🎮 QA Game Testing — Snake

Projeto de **portfólio de QA** focado em **testes de jogos**, aplicado a um jogo **Snake**
feito sob medida para automação. Demonstra **dois níveis complementares de teste de games**:

1. **Testes unitários da lógica do jogo** (Jest) — regras, colisões, pontuação e fronteiras.
2. **Testes E2E do jogo renderizado no browser** (Playwright) — interação real por teclado.

> Construir o jogo-alvo no próprio projeto garante um ambiente **100% determinístico**:
> sem ads, sem rate-limit, sem rede — ideal para um CI verde e confiável.

## 🧠 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│  src/snakeLogic.js      Lógica pura do jogo (sem DOM)       │
│                          - imutável, testável (Jest)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (exposição dupla: CommonJS + window.SnakeLogic)
┌──────────────────────────────▼──────────────────────────────┐
│  public/  (index.html + snake-game.js)  Jogo renderizado    │
│           - teclado (setas) → step(turn(state, dir))          │
│           - expõe window.getGameState()  p/ testes           │
└──────────────────────────────┬──────────────────────────────┘
                               │ servido por scripts/serve.js (http local)
┌──────────────────────────────▼──────────────────────────────┐
│  e2e/  (Playwright, Page Object)      Testes E2E do jogo     │
│           - novo jogo, movimento, inversão, game over, comer │
└─────────────────────────────────────────────────────────────┘
```

**Test hooks** (`/?test`): o jogo expõe `window.__setTestState`, permitindo configurar um
estado inicial para cenários determinísticos (ex.: posicionar o alimento à frente da cobra
para validar a pontuação) — técnica comum em QA de games.

## ✅ O que é coberto

**Lógica (Jest — 12 cenários):** criação do jogo, posicionamento do alimento, seleção de
celula livre, troca de direção, **impedimento de inversão de 180°**, movimento, crescimento
e **pontuação ao comer**, **game over por parede e por colisão com o corpo**, comportamento
após game over.

**E2E (Playwright — 5 cenários):** novo jogo (placar 0 e cobra no centro), movimento pelas
setas, **não inversão de direção**, **game over ao bater na parede**, **placar aumenta ao
comer**.

## 🚀 Stack

- **Jest** — testes unitários da lógica do jogo (cobertura ≥ 90% no gate)
- **Playwright** — E2E do jogo no browser (Chromium)
- **Node** — servidor estático local (`scripts/serve.js`) para o jogo
- **GitHub Actions** — roda lógica + E2E e publica relatório/screenshots

## ▶️ Como rodar

```bash
npm install
npm run install:browsers   # ou: npx playwright install chromium

npm run test:unit          # testes da lógica do jogo (Jest)
npm run test:e2e           # testes E2E do jogo no browser (Playwright)
npm test                   # tudo
```

Para jogar manualmente: `node scripts/serve.js` e abra `http://localhost:4173`.

## 🕹️ Por que testar a lógica separada do DOM?

A lógica pura (colisão, crescimento, placar) é onde moram as regras do jogo — e é onde QA
encontra **bugs off-by-one** e de fronteira. Separar permite testá-la de forma rápida e
determinística, sem desenho/render. Os testes E2E então garantem que o **jogo real** se
comporta como a lógica prevê.

---

**Autoria:** Jessica Sales · QA