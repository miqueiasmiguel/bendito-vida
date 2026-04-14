## Why

O Mapa Bioativo atual exibe os nutrientes prioritários como barras de progresso lineares, o que limita a percepção simultânea de múltiplos atributos nutricionais. Um gráfico teia de aranha (radar chart) permite ao usuário visualizar instantaneamente o equilíbrio entre todos os nutrientes do perfil em uma única forma geométrica — tornando a leitura mais intuitiva e o visual mais diferenciado para a demo do MVP.

## What Changes

- O card "Mapa Bioativo" na tela Home substitui as barras de progresso por um **gráfico radar (teia de aranha) SVG**
- O gráfico exibe até **6 nutrientes** (eixos) em vez dos 3 atuais, com valores normalizados de 0–100
- Cada eixo é rotulado com o nome curto do nutriente e um ícone Lucide opcional
- A área preenchida usa `primary-500` com 30% de opacidade; a borda usa `primary-700`
- Os ingredientes recomendados e o estado vazio permanecem iguais — apenas a visualização central muda
- **BREAKING**: o requisito de "exatamente 3 nutrientes com barra colorida" é substituído por "até 6 nutrientes em radar chart"

## Capabilities

### New Capabilities

- `bioactive-radar-chart`: Componente SVG radar chart que recebe dados de nutrientes normalizados e renderiza a teia de aranha com animação de entrada (Reanimated 4)

### Modified Capabilities

- `home-screen`: O requisito do Mapa Bioativo muda de barras de progresso para radar chart; número de nutrientes exibidos aumenta de 3 para até 6

## Impact

- **Arquivo modificado**: `src/app/(tabs)/home.tsx` (ou componente `BioactiveMap`)
- **Novo componente**: `src/components/dashboard/BioactiveRadarChart.tsx`
- **Spec modificada**: `openspec/specs/home-screen/spec.md` (requisito Mapa Bioativo)
- **Dependência nova**: `react-native-svg` (já deve estar disponível via Expo SDK 55; verificar)
- **Sem mudança** em stores, dados de ingredientes ou lógica de quiz
