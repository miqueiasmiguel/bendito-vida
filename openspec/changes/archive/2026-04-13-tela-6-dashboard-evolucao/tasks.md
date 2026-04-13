## 1. Dependência e Store

- [x] 1.1 Instalar `react-native-chart-kit` e `react-native-svg` (peer dep) via `npx expo install`
- [x] 1.2 Criar `src/stores/useProgressStore.ts` com Zustand: campos `checkins[]`, actions `addCheckin`, `getCurrentWeekCheckin`
- [x] 1.3 Escrever teste unitário para `useProgressStore` (addCheckin, getCurrentWeekCheckin, deduplicação por semana ISO)

## 2. Componentes Dashboard

- [x] 2.1 Criar `src/components/dashboard/WeeklyCheckinCard.tsx` com 3 escalas 1–5 (Disposição, Sono, Foco), botão "Registrar" (habilitado só quando todos preenchidos), e modo read-only quando check-in da semana já existe
- [x] 2.2 Escrever teste unitário para `WeeklyCheckinCard` (estado habilitado/desabilitado, modo read-only)
- [x] 2.3 Criar `src/components/dashboard/EvolutionChart.tsx` com `LineChart` do `react-native-chart-kit`, cor `primary-500`, eixo Y 1–5, máx 8 semanas, banner de onboarding quando sem dados
- [x] 2.4 Escrever teste unitário para `EvolutionChart` (renderiza banner quando sem dados, renderiza gráfico com dados)
- [x] 2.5 Criar `src/components/dashboard/InsightBanner.tsx` com lógica de comparação (melhora / queda / neutro) e textos encorajadores conforme spec
- [x] 2.6 Escrever teste unitário para `InsightBanner` (3 cenários: melhora, queda, neutro/sem anterior)
- [x] 2.7 Exportar `WeeklyCheckinCard`, `EvolutionChart`, `InsightBanner` em `src/components/dashboard/index.ts`

## 3. Tela Progress

- [x] 3.1 Substituir placeholder `src/app/(tabs)/progress.tsx` pela implementação real: ScrollView com `WeeklyCheckinCard`, `EvolutionChart` e `InsightBanner`, usando tokens do tema (sem hardcode de cores)
- [x] 3.2 Conectar `progress.tsx` ao `useProgressStore` (ler checkins, passar `addCheckin` para `WeeklyCheckinCard`)

## 4. Validação Final

- [x] 4.1 Verificar que `npm run validate` (lint + testes) passa sem erros
- [x] 4.2 Confirmar que `expo-doctor` não reporta warnings novos após instalação das libs
