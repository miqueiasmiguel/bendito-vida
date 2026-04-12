## 1. Dados e Algoritmo

- [x] 1.1 Criar `src/data/quiz-questions.ts` com as 5 perguntas, opções e tags de nutrientes (estrutura `QuizQuestion[]`)
- [x] 1.2 Criar `src/data/ingredients.ts` com ≥10 ingredientes paraibanos placeholder (nome, nutrientes associados, marcados como `// TODO: validar`)
- [x] 1.3 Criar `src/utils/match-profile.ts` com função `matchProfile(answers)` — reduce sobre tags, top 3 nutrientes, ingredientes sugeridos
- [x] 1.4 Escrever testes unitários para `matchProfile`: seleção única, multi-seleção, desempate por precedência

## 2. Store Zustand

- [x] 2.1 Criar `src/stores/useQuizStore.ts` com estado `answers`, `nutritionProfile` e ações `setAnswer`, `setProfile`, `reset`
- [x] 2.2 Escrever teste unitário para `useQuizStore`: setAnswer, multi-seleção, exclusividade "Nenhuma", setProfile

## 3. Componentes UI do Quiz

- [x] 3.1 Criar `src/components/quiz/QuizOption.tsx` — card de opção com estado active/inactive, borda `primary-700`, accessibilityRole="button", accessibilityState
- [x] 3.2 Criar `src/components/quiz/QuizProgressBar.tsx` — barra de progresso com label "X de 5", accessibilityRole="progressbar", animação Reanimated 4
- [x] 3.3 Verificar se `src/components/ui/Button.tsx` atende — reutilizar para botão "Próximo"/"Concluir"; se não existir, criar conforme design system
- [x] 3.4 Escrever teste unitário para `QuizOption`: render, seleção, acessibilidade
- [x] 3.5 Escrever teste unitário para `QuizProgressBar`: progresso correto, labels

## 4. Tela do Quiz

- [x] 4.1 Criar `src/app/(onboarding)/_layout.tsx` com `<Stack screenOptions={{ headerShown: false }} />`
- [x] 4.2 Implementar `src/app/(onboarding)/quiz.tsx` com `FlatList` horizontal paginada (`pagingEnabled`, `getItemLayout`)
- [x] 4.3 Integrar `useQuizStore` na tela: `setAnswer` ao selecionar, `setProfile(matchProfile(answers))` + `router.replace('/(tabs)/home')` ao concluir
- [x] 4.4 Implementar animação do botão "Próximo" (fade in/out com Reanimated 4 `useAnimatedStyle`, 300ms ease-out)
- [x] 4.5 Garantir touch area ≥44x44 em todos os elementos interativos

## 5. Integração com Navegação

- [x] 5.1 Atualizar `src/app/index.tsx` — botão "Começar" usa `router.push('/(onboarding)/quiz')` ou `<Link href="/(onboarding)/quiz">`
- [x] 5.2 Exportar `QuizOption` e `QuizProgressBar` em `src/components/ui/index.ts` se forem componentes genéricos (avaliar)

## 6. Verificação Final

- [x] 6.1 Executar `npm run validate` (lint + type-check + testes) — zero erros
- [x] 6.2 Verificar cobertura ≥60% nos novos arquivos (`match-profile.ts`, `useQuizStore.ts`, componentes quiz)
- [x] 6.3 Confirmar que `expo-doctor` não reporta warnings nos novos arquivos
