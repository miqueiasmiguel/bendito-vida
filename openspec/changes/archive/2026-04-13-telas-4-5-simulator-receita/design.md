## Context

O Simulador "Meu Mix" é a feature central do MVP. O fluxo completo é: usuário chega da Home (Mapa Bioativo) → monta seu mix no Simulador → gera o Cartão de Receita. Toda a lógica nutricional é local (sem API), o que garante resposta <200ms mesmo sem conexão.

Estado atual: `src/data/ingredients.ts` e `src/data/nutrition-engine.ts` já existem com dados e funções prontas. `useSimulatorStore` ainda não existe. As rotas `/(tabs)/simulator` e `/result` existem como arquivos mas sem implementação completa.

## Goals / Non-Goals

**Goals:**
- Jarro SVG animado com Reanimated 4 que preenche proporcionalmente aos ingredientes adicionados
- IngredientCards scrolláveis horizontalmente com toque para add/remover
- 4 barras nutricionais (Fibras, Proteínas, Ômega-3, Calorias) atualizando em tempo real via store
- Nudges como toasts contextuais baseados no estado do mix
- Cartão de Receita compartilhável via `expo-sharing`, com opção de salvar no perfil (Supabase `mixes`)

**Non-Goals:**
- Drag-and-drop (usar toque simples conforme CLAUDE.md)
- Backend custom ou cálculo remoto
- Animações 3D ou físicas complexas no jarro
- Edição de proporções por ingrediente (porção fixa de 30g)

## Decisions

### 1. Jarro SVG com `react-native-svg` + Reanimated 4
O jarro é implementado como SVG estático com um `<Rect>` ou `<Path` de preenchimento animado via `useAnimatedProps`. O nível do líquido é derivado de `totalCalories / MAX_CALORIES` clampado a 0-1.

**Alternativa considerada:** View com height animada (mais simples) — rejeitada porque parece menos orgânico; SVG permite forma curva e visual premium exigido pelo edital.

### 2. Zustand `useSimulatorStore` como fonte de verdade
O store mantém `selectedIngredients: Ingredient[]`. A nutrition é calculada inline com `calculateNutrition` (memo via `useMemo` no componente, sem selector derivado no store) para manter o store simples.

**Alternativa considerada:** Selector derivado no Zustand — rejeitada para não complexificar o store com lógica que já está em `nutrition-engine.ts`.

### 3. Nudges via toast com fila FIFO (máx 1 visível por vez)
Nudges são gerados no `useEffect` que observa `selectedIngredients`. São exibidos com uma animação slide-up de 300ms (Reanimated 4) e auto-dismiss em 3s. Fila garante que múltiplos nudges não sobreponham.

### 4. Cartão de Receita como tela separada `/result`
O resultado é uma rota stack (`/result`) recebendo os dados do mix via `useSimulatorStore` (sem parâmetros de rota para evitar serialização de objetos complexos). O cartão é capturado como imagem via `react-native-view-shot` + `expo-sharing` para compartilhar.

**Alternativa considerada:** Passar dados via `router.push` params — rejeitada porque a serialização de array de ingredientes em URL é frágil.

### 5. Salvar mix no Supabase
O botão "Salvar no perfil" faz `INSERT` na tabela `mixes` com `user_id` do `useAuthStore`. Se não autenticado, redireciona para login.

## Risks / Trade-offs

- **[Risco] Performance do SVG em devices mais antigos** → Mitigação: usar `useAnimatedProps` no UI thread (Reanimated 4), evitar re-renders desnecessários com `React.memo` nos IngredientCards
- **[Risco] `react-native-view-shot` pode ter latência ao capturar** → Mitigação: mostrar loading no botão "Compartilhar" durante captura
- **[Trade-off] Porção fixa 30g** → Simplifica o cálculo e a UI; usuário não pode ajustar quantidade por ingrediente no MVP
- **[Risco] `expo-sharing` pode não estar instalado** → Verificar e adicionar à instalação; fallback: copiar texto do mix para clipboard
