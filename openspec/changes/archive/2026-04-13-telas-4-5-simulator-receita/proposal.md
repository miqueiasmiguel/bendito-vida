## Why

O simulador "Meu Mix" é a feature core do edital de Segurança Alimentar e Nutricional — é o que vai ser demonstrado para os avaliadores e precisa ter impacto visual e funcional imediato. Sem ele e o Cartão de Receita, o fluxo principal do app está incompleto.

## What Changes

- Implementar a Tela 4 (Simulador "Meu Mix"): jarro virtual SVG com animações Reanimated 4, lista de ingredientes scrollável, 4 barras nutricionais dinâmicas e nudges contextuais (toasts)
- Implementar a Tela 5 (Cartão de Receita): card estilizado com resumo nutricional, badges paraibanos, e ações de compartilhar (expo-sharing) e salvar no perfil
- Criar/atualizar `useSimulatorStore` (Zustand) para gerenciar ingredientes selecionados e estado do mix
- Conectar o cálculo nutricional local (`calculateNutrition` + `generateNudges`) em tempo real (<200ms)
- Adicionar componentes: `MixJar`, `IngredientCard`, `NutrientBar`, `NudgeAlert`, `RecipeCard`
- Rota `/(tabs)/simulator` e `/result` operacionais

## Capabilities

### New Capabilities
- `mix-simulator`: Simulador interativo de mix nutricional com jarro SVG, adição/remoção de ingredientes por toque, barras nutricionais em tempo real e nudges contextuais
- `recipe-card`: Cartão de receita gerado a partir do mix, com resumo nutricional, badges de biodiversidade paraibana, compartilhamento e salvamento no perfil

### Modified Capabilities
- `app-navigation`: Adicionar rota `/result` ao stack de navegação raiz e garantir que a tab `simulator` esteja ativa

## Impact

- `src/app/(tabs)/simulator.tsx` — tela do simulador (nova)
- `src/app/result.tsx` — tela do cartão de receita (nova)
- `src/components/simulator/` — MixJar, IngredientCard, NutrientBar, NudgeAlert (novos)
- `src/components/ui/RecipeCard.tsx` — componente de cartão compartilhável (novo)
- `src/stores/useSimulatorStore.ts` — store Zustand (novo)
- `src/data/ingredients.ts` — já existe, sem alteração estrutural
- `src/data/nutrition-engine.ts` — já existe, sem alteração
- Dependência nova: `expo-sharing` (para compartilhar o cartão)
