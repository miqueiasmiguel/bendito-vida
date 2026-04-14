## Context

O Mapa Bioativo atual renderiza os nutrientes prioritários do `nutritionProfile` como uma lista de barras de progresso (`ProgressBar`). A mudança substitui esse visual por um gráfico radar (teia de aranha) SVG, exibindo até 6 eixos normalizados de 0–100. O projeto usa Expo SDK 55 com New Architecture; `react-native-svg` já está disponível no Expo Go/dev build via dependência transitiva (`expo-svg`) e pode ser importado diretamente.

## Goals / Non-Goals

**Goals:**
- Substituir as barras de progresso no card Mapa Bioativo por um radar chart SVG com animação de entrada
- Exibir até 6 nutrientes/eixos (3 era o limite anterior)
- Manter o estado vazio e a lista de ingredientes recomendados inalterados
- Componente reutilizável, testável e tipado

**Non-Goals:**
- Interatividade nos eixos do radar (toque em eixo = detalhes) — fora do MVP
- Suporte a mais de 6 eixos — 6 é o limite visual razoável
- Alteração de stores, lógica do quiz ou dados nutricionais
- Suporte a temas claros/escuros dinâmicos (app usa tema fixo creme/verde)

## Decisions

### 1. SVG puro via `react-native-svg` em vez de biblioteca de charts

**Decisão**: Implementar o radar chart com `react-native-svg` (`Polygon`, `Line`, `Text`, `Circle`) sem biblioteca de terceiros (Victory Native, react-native-chart-kit, etc.).

**Rationale**: Bibliotecas de charts adicionam bundle size significativo e frequentemente têm incompatibilidades com New Architecture. O radar chart é geometricamente simples — polígono regular + área preenchida — e pode ser desenhado em ~80 linhas de código com matemática de coordenadas polares. Controle total sobre estilo, tokens de cor e animação.

**Alternativa considerada**: `victory-native` — descartado por incompatibilidade parcial com Reanimated 4 e overhead de ~150KB.

### 2. Animação de entrada via Reanimated 4 (`useSharedValue` + `withTiming`)

**Decisão**: Animar o `scale` do polígono de 0 → 1 com `withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })` no mount do componente.

**Rationale**: Alinhado com o padrão do projeto (Reanimated 4 obrigatório). A animação roda no UI thread, sem jank. Efeito de "crescimento" da teia reforça a metáfora visual.

### 3. Normalização dos valores

**Decisão**: O componente recebe `data: Array<{ label: string; value: number; maxValue: number }>` e normaliza internamente para 0–1 (`value / maxValue`). O caller (Home screen) passa os valores brutos do `nutritionProfile`.

**Rationale**: Separação de responsabilidades — o componente não conhece a escala de nutrientes. Facilita testes unitários com valores arbitrários.

### 4. Número de eixos: até 6, mínimo 3

**Decisão**: Se o `nutritionProfile` retornar menos de 3 nutrientes, o card mantém o estado vazio. Entre 3 e 6, todos são exibidos. Acima de 6, os primeiros 6 por score são usados.

**Rationale**: Radar charts com menos de 3 eixos não fazem sentido geometricamente; acima de 6 ficam ilegíveis em telas mobile de 5".

## Risks / Trade-offs

- **`react-native-svg` não instalado** → Verificar `package.json`; se ausente, adicionar `expo install react-native-svg`. Probabilidade baixa (é dependência transitiva de vários pacotes Expo).
- **Legibilidade dos labels em telas pequenas (5")** → Usar fonte 11px (mínimo do design system) para labels dos eixos; truncar em 8 chars se necessário.
- **Teste do componente SVG com Jest** → `react-native-svg` requer mock em ambiente Jest. Adicionar mock em `jest.setup.js` (`jest.mock('react-native-svg', ...)`). O mock já pode existir no projeto.
