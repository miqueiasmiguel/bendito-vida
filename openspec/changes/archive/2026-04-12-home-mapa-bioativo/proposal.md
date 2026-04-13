## Why

O fluxo pós-quiz não tem destino: o usuário conclui a triagem nutricional mas não vê o resultado personalizado nem tem CTA claro para usar o Simulador. A Tela 3 (Home/Mapa Bioativo) fecha esse gap exibindo o perfil bioativo gerado, os nutrientes prioritários e o caminho para o core feature do app.

## What Changes

- Nova tela `/(tabs)/home` com saudação personalizada e Mapa Bioativo
- Card de Mapa Bioativo exibindo 3 nutrientes prioritários (ícones + barras de progresso) e 3-5 ingredientes recomendados (badge "Paraibano" quando aplicável)
- CTA "Montar meu Mix" → navega para o Simulador
- Card de Check-in semanal (exibido apenas quando disponível)
- Dica do dia rotativa sobre ingrediente paraibano
- Leitura do `bioactive_profile` do `useQuizStore` / Supabase para popular o Mapa Bioativo

## Capabilities

### New Capabilities

- `home-screen`: Tela principal pós-onboarding com saudação, Mapa Bioativo, CTA para Simulador, check-in semanal e dica do dia

### Modified Capabilities

- `quiz-onboarding`: O resultado do quiz agora precisa ser consumido pela Home — o campo `bioactive_profile` do store já existe, mas a navegação pós-quiz deve redirecionar para `/(tabs)/home` em vez de permanecer na tela de quiz

## Impact

- Novo arquivo: `src/app/(tabs)/home.tsx`
- Novo arquivo: `src/components/dashboard/BioactiveMap.tsx`
- Novo arquivo: `src/components/dashboard/DailyTip.tsx`
- Novo arquivo: `src/components/dashboard/WeeklyCheckinCard.tsx` (placeholder — lógica completa na Tela 6)
- Utiliza `useQuizStore` (já existe) para ler `nutritionProfile` / `bioactiveProfile`
- Utiliza `useAuthStore` para ler `user.name`
- Leitura de `ingredients` de `src/data/ingredients.ts` para mapear ingredientes sugeridos
- Dependência nova: nenhuma (todos os pacotes já instalados)
- Navegação: ajuste em `/(onboarding)/quiz` para redirecionar para `/(tabs)/home` após último passo
