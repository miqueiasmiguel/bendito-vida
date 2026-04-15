## 1. Dependências e Configuração

- [x] 1.1 Verificar se `expo-auth-session` e `expo-web-browser` já estão instalados; instalar se necessário
- [x] 1.2 Adicionar `scheme: "bendito-vida"` ao `app.json`
- [x] 1.3 Confirmar que variáveis `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` estão configuradas

## 2. Auth Store

- [x] 2.1 Refatorar `src/stores/useAuthStore.ts` removendo métodos de email/senha (`signIn`, `signUp`, etc.)
- [x] 2.2 Adicionar método `signInWithGoogle` ao store usando `expo-auth-session` + `supabase.auth.signInWithOAuth`
- [x] 2.3 Garantir que o store escuta `supabase.auth.onAuthStateChange` para persistência de sessão entre restarts

## 3. Tela Welcome (index.tsx)

- [x] 3.1 Remover botões "Começar" e "Já tenho conta" de `src/app/index.tsx`
- [x] 3.2 Adicionar botão "Entrar com Google" conectado ao método `signInWithGoogle` do store
- [x] 3.3 Adicionar estado de loading com ActivityIndicator e botão desabilitado durante o fluxo OAuth
- [x] 3.4 Adicionar tratamento de erro com mensagem visível ao usuário
- [x] 3.5 Garantir acessibilidade: `accessibilityLabel`, touch area ≥ 44x44

## 4. Remoção das Telas Antigas

- [x] 4.1 Deletar `src/app/(auth)/login.tsx`
- [x] 4.2 Deletar `src/app/(auth)/register.tsx`
- [x] 4.3 Buscar e remover todas as referências a `/(auth)/login` e `/(auth)/register` no codebase

## 5. Testes

- [x] 5.1 Escrever teste unitário para `useAuthStore` cobrindo `signInWithGoogle` (mock do Supabase)
- [x] 5.2 Atualizar/escrever teste unitário para `WelcomeScreen` (renderiza botão Google, exibe loading, exibe erro)
- [x] 5.3 Escrever teste unitário para `AuthCallbackScreen` (exchangeCodeForSession, navegação sucesso/erro/sem code)

## 6. Fix: Android OAuth callback

- [x] 6.1 Trocar `flowType: 'implicit'` por `flowType: 'pkce'` em `src/lib/supabase.ts`
- [x] 6.2 Criar `src/app/(auth)/callback.tsx` — rota que o Android navega após o deep link (o OS entrega o intent diretamente ao Expo Router em vez de retornar para `openAuthSessionAsync`)
- [x] 6.3 Atualizar `signInWithGoogle` no store para usar `exchangeCodeForSession` no caminho iOS (onde `openAuthSessionAsync` retorna `type: 'success'` com `?code=`)
- [x] 6.4 Atualizar testes do store para refletir PKCE (`exchangeCodeForSession` no lugar de `setSession`)
