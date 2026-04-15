## Why

Atualmente, qualquer usuário pode acessar o app diretamente sem passar pelo quiz de triagem, o que quebra o fluxo de personalização nutricional — o núcleo do produto. O onboarding deve ser obrigatório na primeira vez para garantir que o perfil nutricional seja criado antes de qualquer outra interação.

## What Changes

- O root layout passará a verificar se o usuário já completou o onboarding antes de renderizar qualquer rota.
- Usuários que nunca completaram o onboarding são redirecionados para `/(onboarding)/quiz` independentemente da rota que tentaram acessar.
- Usuários que já completaram o onboarding alguma vez têm acesso livre (mesmo que desinstalam e reinstalam — a flag é persistida no Supabase vinculada à conta).
- A flag de conclusão do onboarding (`onboarding_completed`) é gravada no Supabase ao finalizar o quiz e consultada no boot do app.
- Para usuários não autenticados (anônimos/sem conta), a verificação não se aplica — a tela de Welcome e o fluxo de auth continuam acessíveis normalmente.

## Capabilities

### New Capabilities
- `onboarding-gate`: Guard que verifica se o usuário autenticado já completou o onboarding e redireciona para o quiz caso contrário, bloqueando acesso às rotas principais.

### Modified Capabilities
- `app-navigation`: O fluxo de navegação do root layout precisa incorporar a lógica de gate — após auth resolvida, verificar flag de onboarding antes de renderizar as tabs.
- `quiz-onboarding`: A conclusão do quiz deve gravar `onboarding_completed = true` no Supabase (perfil do usuário) e liberar a navegação para as tabs.

## Impact

- `src/app/_layout.tsx` — adiciona lógica de verificação de onboarding no boot
- `src/stores/useAuthStore.ts` — pode precisar expor flag `onboardingCompleted`
- `src/stores/useQuizStore.ts` — ação de conclusão do quiz deve persistir flag no Supabase
- Supabase: tabela `profiles` precisa de coluna `onboarding_completed boolean default false`
- `src/app/(onboarding)/quiz.tsx` — ao concluir, persiste flag e navega para `/(tabs)/home`
