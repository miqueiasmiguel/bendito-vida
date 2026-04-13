## Why

O MVP precisa demonstrar ao avaliador do edital que o app acompanha a evolução do usuário ao longo do tempo, fechando o loop de gamificação. A Tela 6 (Dashboard de Evolução) é o único ponto de evidência de progressão: sem ela, o fluxo Welcome → Quiz → Home → Simulador → Receita não tem continuidade.

## What Changes

- Nova tela `(tabs)/progress.tsx` com tab "Evolução" no layout nativo
- Formulário de check-in semanal (3 escalas 1-5: Disposição, Sono, Foco)
- Gráfico de linha semanal usando `react-native-chart-kit`
- Insight textual gerado a partir do histórico de check-ins
- Store Zustand `useProgressStore` para persistência local dos check-ins
- Componentes: `WeeklyCheckinCard`, `EvolutionChart`, `InsightBanner`

## Capabilities

### New Capabilities
- `progress-dashboard`: Tela com check-in semanal, gráfico de evolução e insight contextual

### Modified Capabilities
- `app-navigation`: Adiciona a tab "Evolução" (`progress`) ao layout de tabs com ícone TrendingUp

## Impact

- **Novo arquivo:** `src/app/(tabs)/progress.tsx`
- **Novo store:** `src/stores/useProgressStore.ts`
- **Novos componentes:** `src/components/dashboard/WeeklyCheckinCard.tsx`, `src/components/dashboard/EvolutionChart.tsx`, `src/components/dashboard/InsightBanner.tsx`
- **Dependência nova:** `react-native-chart-kit` + `react-native-svg` (peer dep)
- **Modificado:** `src/app/(tabs)/_layout.tsx` (adicionar Screen para `progress`)
- **Sem breaking changes** — tela nova, sem alteração de contratos existentes
