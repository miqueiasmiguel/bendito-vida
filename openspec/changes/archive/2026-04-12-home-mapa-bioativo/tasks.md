## 1. Utilitário de Recomendação de Ingredientes

- [x] 1.1 Criar `src/utils/match-profile.ts` com função `matchIngredientsByProfile(tags: string[]): Ingredient[]` — filtra por intersecção de tags, ordena por contagem de matches, retorna top 5
- [x] 1.2 Escrever teste unitário para `matchIngredientsByProfile` em `src/utils/__tests__/match-profile.test.ts`

## 2. Componentes de Dashboard

- [x] 2.1 Criar `src/components/dashboard/BioactiveMap.tsx` — recebe `nutrients: NutrientItem[]` e `recommendedIngredients: Ingredient[]` como props; exibe card com 3 nutrientes (ícone + label + barra) e lista de ingredientes com badge "Paraibano"
- [x] 2.2 Criar `src/components/dashboard/DailyTip.tsx` — recebe `ingredient: Ingredient` como prop; exibe card compacto com nome e `benefit`
- [x] 2.3 Criar `src/components/dashboard/WeeklyCheckinCard.tsx` — card estático com título "Check-in da semana" e botão "Responder" (onPress vazio por ora)
- [x] 2.4 Escrever teste unitário para `BioactiveMap` (renderiza nutrientes e badge condicional)

## 3. Tela Home

- [x] 3.1 Criar `src/app/(tabs)/home.tsx` com `ScrollView` wrapping, saudação "Olá, [Nome]!", `BioactiveMap`, CTA "Montar meu Mix" (navega para `/(tabs)/simulator`), `WeeklyCheckinCard` e `DailyTip`
- [x] 3.2 Implementar estado vazio no `BioactiveMap` quando `nutritionProfile` está vazio — exibir mensagem e botão "Fazer Quiz" que navega para `/(onboarding)/quiz`
- [x] 3.3 Implementar seleção determinística da dica do dia: `ingredients[new Date().getDay() % ingredients.length]`

## 4. Ajuste de Navegação pós-Quiz

- [x] 4.1 No arquivo do quiz (`src/app/(onboarding)/quiz.tsx`), substituir navegação do último passo por `router.replace('/(tabs)/home')`

## 5. Verificação Final

- [x] 5.1 Confirmar que `src/components/dashboard/index.ts` exporta os três novos componentes
- [x] 5.2 Rodar `npm run validate` (lint + testes) sem erros
