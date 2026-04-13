## Context

O app já possui `useQuizStore` com `nutritionProfile` (tags acumuladas das respostas do quiz) e a estrutura de ingredientes em `src/data/ingredients.ts`. A Tela 3 é a primeira tela "logada" — consumida após o quiz. Ela precisa traduzir o perfil gerado em algo visualmente claro e motivador, servindo de hub de navegação para o Simulador (core feature).

Estado atual: `/(tabs)/home.tsx` ainda não existe. O quiz finaliza sem redirecionar o usuário para lugar algum.

## Goals / Non-Goals

**Goals:**
- Exibir saudação personalizada com nome do usuário (via `useAuthStore`)
- Renderizar o Mapa Bioativo com os 3 nutrientes prioritários e até 5 ingredientes recomendados derivados do `nutritionProfile`
- CTA visível para `/(tabs)/simulator`
- Placeholder de check-in semanal (UI estática — lógica real na Tela 6)
- Dica do dia rotativa (seleção por `Date.getDay() % ingredients.length`)
- Redirecionar quiz pós-conclusão para `/(tabs)/home`

**Non-Goals:**
- Lógica de check-in real (pertence à Tela 6)
- Sincronização do `bioactive_profile` com Supabase (pode ser feita em iteração futura; o store local é suficiente para o MVP)
- Notificações push

## Decisions

### 1. Derivar recomendações de ingredientes localmente (sem API)

Os ingredientes têm `tags[]` que fazem correspondência direta com as tags do `nutritionProfile`. A função de mapeamento (`matchIngredientsByProfile`) filtra `ingredients` por intersecção de tags, ordena por contagem de matches e retorna os top 5.

**Alternativa descartada:** Buscar recomendações do Supabase — over-engineering para MVP; dados de ingredientes são estáticos.

### 2. BioactiveMap como componente puro (sem side-effects)

`BioactiveMap` recebe `nutrients` e `recommendedIngredients` como props, sem acessar stores diretamente. Isso facilita teste unitário e reutilização no Perfil (Tela 7).

### 3. Dica do dia determinística por dia da semana

`tip = ingredients[dayOfWeek % ingredients.length]` — sem estado, sem persistência, reproduzível. Suficiente para demo.

### 4. Navegação pós-quiz via `router.replace`

Usar `router.replace('/(tabs)/home')` (não `push`) para que o botão "voltar" não retorne ao quiz após o onboarding concluído.

## Risks / Trade-offs

- **[Risco] `nutritionProfile` vazio se usuário acessar Home sem completar o quiz** → Mitigação: exibir estado vazio amigável ("Complete o quiz para ver seu Mapa Bioativo") com CTA para o quiz
- **[Trade-off] Dados nutricionais dos ingredientes são placeholders** → Declarado explicitamente no `ingredients.ts`; aceitável para MVP/demo
- **[Risco] Layout quebrado em telas menores (5")** → Usar `ScrollView` wrapping toda a tela; testar no simulador de iPhone SE
