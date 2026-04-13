## 1. Dependências e Store

- [x] 1.1 Instalar `react-native-view-shot` e `expo-sharing` via `npx expo install`
- [x] 1.2 Criar `src/stores/useSimulatorStore.ts` com Zustand: estado `selectedIngredients: Ingredient[]`, ações `addIngredient`, `removeIngredient`, `clearMix`

## 2. Componentes do Simulador

- [x] 2.1 Criar `src/components/simulator/MixJar.tsx`: jarro SVG com `react-native-svg`, nível de preenchimento animado via `useAnimatedProps` (Reanimated 4), prop `fillLevel: number` (0-1) e `fillColor: string`
- [x] 2.2 Criar `src/components/simulator/IngredientCard.tsx`: card com nome, ícone Lucide, badge "Paraibano", borda ativa quando selecionado; touch area ≥ 44x44; 1 teste unitário
- [x] 2.3 Criar `src/components/simulator/NutrientBar.tsx`: barra com label, valor numérico, cor configurável e largura animada; 1 teste unitário
- [x] 2.4 Criar `src/components/simulator/NudgeAlert.tsx`: toast slide-up com Reanimated 4, auto-dismiss 3s, fila FIFO (máx 1 visível), variantes `warning`/`suggestion`/`info`

## 3. Tela Simulador

- [x] 3.1 Implementar `src/app/(tabs)/simulator.tsx`: layout split (jarro 40% / lista 60%), integrar `MixJar` conectado ao store
- [x] 3.2 Adicionar `ScrollView` horizontal com todos os `IngredientCard`s mapeados de `src/data/ingredients.ts`
- [x] 3.3 Adicionar 4 `NutrientBar`s calculados via `calculateNutrition` + `useMemo`, com cores corretas (Fibras verde, Proteínas azul, Ômega-3 dourado, Calorias vermelho se >500)
- [x] 3.4 Integrar `NudgeAlert` com `generateNudges` no `useEffect` que observa `selectedIngredients`
- [x] 3.5 Adicionar botão "Gerar Minha Receita" fixo no bottom (accent-500, desabilitado se mix vazio), navegando para `/result`

## 4. Componente RecipeCard e Tela Result

- [x] 4.1 Criar `src/components/ui/RecipeCard.tsx`: card branco radius 16 exibindo título, lista de ingredientes com proporções, 4 indicadores nutricionais, badge paraibano condicional; exportar em `src/components/ui/index.ts`; 1 teste unitário
- [x] 4.2 Implementar `src/app/result.tsx`: renderiza `RecipeCard` com dados do `useSimulatorStore`, botões "Compartilhar" e "Salvar no perfil", header de voltar
- [x] 4.3 Implementar lógica de compartilhamento: capturar card com `react-native-view-shot`, compartilhar com `expo-sharing`; loading durante captura; desabilitar se sharing indisponível
- [x] 4.4 Implementar lógica de salvar: INSERT em `mixes` via Supabase com `useAuthStore`; redirecionar para login se não autenticado; feedback "Mix salvo!" e estado "Salvo" no botão após sucesso

## 5. Navegação

- [x] 5.1 Garantir que `/result` está como stack screen no root layout `src/app/_layout.tsx` (sem tab bar)
- [x] 5.2 Atualizar spec arquivada de `app-navigation` após implementação (via `openspec sync`)

## 6. Qualidade

- [x] 6.1 Rodar `npm run validate` (lint + TypeScript + testes) e corrigir todos os erros
- [x] 6.2 Verificar que cobertura de testes ≥ 60% nos novos componentes
