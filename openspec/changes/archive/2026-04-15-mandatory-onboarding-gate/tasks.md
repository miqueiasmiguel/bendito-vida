## 1. Supabase — Schema

- [x] 1.1 Adicionar coluna `onboarding_completed boolean default false` na tabela `profiles` via migration SQL no Supabase (dashboard ou CLI)
- [x] 1.2 Verificar que RLS de `profiles` permite leitura e escrita pelo próprio usuário (`auth.uid() = id`)

## 2. useAuthStore — Estado e Ação

- [x] 2.1 Adicionar campo `onboardingCompleted: boolean` (default `false`) à interface e estado inicial do `useAuthStore`
- [x] 2.2 Implementar ação assíncrona `markOnboardingComplete()`: faz `upsert` em `profiles` com `{ onboarding_completed: true }` e atualiza `onboardingCompleted: true` no store
- [x] 2.3 No carregamento da sessão (inicialização do store), buscar `profiles.onboarding_completed` do Supabase e popular `onboardingCompleted` no store
- [x] 2.4 Escrever teste unitário para `markOnboardingComplete` (mock do supabase client)

## 3. Root Layout — Gate de Onboarding

- [x] 3.1 Adicionar ao `_layout.tsx` um `useEffect` que observa `{ session, onboardingCompleted }` do `useAuthStore`
- [x] 3.2 Lógica do gate: se `session` existe E `!onboardingCompleted` → `router.replace('/(onboarding)/quiz')`
- [x] 3.3 Manter o splash screen visível (`SplashScreen.hideAsync` só após fontes prontas E estado de auth/onboarding resolvido)
- [x] 3.4 Garantir que usuários não autenticados (sem session) não sejam redirecionados para o quiz

## 4. Quiz — Persistência ao Concluir

- [x] 4.1 Na tela `/(onboarding)/quiz`, ao pressionar "Concluir" (última pergunta), chamar `markOnboardingComplete()` antes de `router.replace('/(tabs)/home')`
- [x] 4.2 Envolver a chamada em try/catch: em caso de erro do Supabase, logar o erro e navegar normalmente (não bloquear o usuário)
- [x] 4.3 Garantir que `setProfile(profile)` ainda é chamado antes da navegação

## 5. Testes e Verificação

- [x] 5.1 Testar fluxo completo: novo usuário → Welcome → Auth → Quiz → Tabs (gate não bloqueia após conclusão)
- [x] 5.2 Testar gate: usuário autenticado com `onboarding_completed = false` abre o app → redirecionado para quiz
- [x] 5.3 Testar gate: usuário autenticado com `onboarding_completed = true` abre o app → tabs acessíveis normalmente
- [x] 5.4 Testar usuário não autenticado: Welcome renderiza sem redirecionamento para quiz
- [x] 5.5 Verificar que o botão "Voltar" do dispositivo não retorna ao quiz após conclusão (stack de navegação limpo via `replace`)
