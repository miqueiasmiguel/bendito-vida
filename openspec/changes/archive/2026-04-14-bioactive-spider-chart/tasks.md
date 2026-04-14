## 1. Dependência SVG

- [x] 1.1 Verificar se `react-native-svg` está em `package.json`; se ausente, executar `expo install react-native-svg`
- [x] 1.2 Adicionar mock de `react-native-svg` em `jest.setup.js` se ainda não existir

## 2. Componente BioactiveRadarChart

- [x] 2.1 Criar `src/components/dashboard/BioactiveRadarChart.tsx` com interface `BioactiveRadarChartProps` exportada
- [x] 2.2 Implementar cálculo de coordenadas polares para N eixos (3–6) distribuídos em 360°
- [x] 2.3 Renderizar grade de fundo (círculos ou polígonos concêntricos em 25%, 50%, 75%, 100%) usando `react-native-svg`
- [x] 2.4 Renderizar linhas de eixo do centro até a borda para cada nutriente
- [x] 2.5 Renderizar `Polygon` preenchido com os pontos de valor normalizado (`primary-500`, opacidade 0.3)
- [x] 2.6 Renderizar borda do polígono de valor (`primary-700`, strokeWidth 2)
- [x] 2.7 Renderizar labels dos eixos (Poppins 11px, `neutral-700`, truncar em 8 chars)
- [x] 2.8 Adicionar animação de entrada com Reanimated 4 (`useSharedValue(0)` → `withTiming(1, 600ms)`) no scale do polígono
- [x] 2.9 Adicionar `accessibilityLabel` e `accessibilityRole="image"` no elemento raiz

## 3. Testes do componente

- [x] 3.1 Criar `src/components/dashboard/__tests__/BioactiveRadarChart.test.tsx`
- [x] 3.2 Testar renderização com 3 nutrientes (mínimo)
- [x] 3.3 Testar renderização com 6 nutrientes (máximo)
- [x] 3.4 Testar truncamento de label com mais de 8 caracteres
- [x] 3.5 Testar que `accessibilityLabel` está presente no output

## 4. Integração na tela Home

- [x] 4.1 Localizar o bloco do card Mapa Bioativo em `src/app/(tabs)/home.tsx` (ou componente extraído)
- [x] 4.2 Mapear os nutrientes do `nutritionProfile` para o formato `{ label, value, maxValue }` esperado pelo `BioactiveRadarChart`
- [x] 4.3 Limitar a 6 nutrientes (os de maior score), caso o perfil retorne mais
- [x] 4.4 Substituir as instâncias de `ProgressBar` / lista de nutrientes pelo `BioactiveRadarChart`
- [x] 4.5 Manter estado vazio inalterado ("Complete o quiz para ver seu Mapa Bioativo")

## 5. Exportar e validar

- [x] 5.1 Exportar `BioactiveRadarChart` em `src/components/ui/index.ts` ou `src/components/dashboard/index.ts` (conforme padrão existente)
- [x] 5.2 Executar `npm run validate` (lint + testes) sem erros
- [x] 5.3 Verificar visual no simulador/emulador com perfis de 3, 4 e 6 nutrientes
