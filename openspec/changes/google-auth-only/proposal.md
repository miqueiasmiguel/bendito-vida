## Why

O fluxo atual de autenticação com email/senha e tela de cadastro separada adiciona fricção desnecessária para o usuário final. Substituir por Google Sign-In diretamente na tela de boas-vindas simplifica o onboarding, elimina gerenciamento de senhas e mantém uma entrada de app limpa.

## What Changes

- **BREAKING** Remover telas `/(auth)/login.tsx` e `/(auth)/register.tsx`
- Modificar `src/app/index.tsx` (Welcome): substituir botões "Começar" e "Já tenho conta" por botão "Entrar com Google"
- Implementar Google OAuth via Supabase (provider `google`) acionado direto da tela Welcome
- Atualizar `useAuthStore` para suportar fluxo OAuth (sem email/senha)
- Remover campos de email/senha do store e tipos relacionados

## Capabilities

### New Capabilities

- `google-sign-in`: Autenticação Google OAuth via Supabase acionada diretamente da tela Welcome (`index.tsx`), sem telas de login/cadastro separadas

### Modified Capabilities

- `welcome-screen`: Os botões "Começar" e "Já tenho conta" são substituídos por um único botão "Entrar com Google"
- `app-navigation`: Rotas `/(auth)/login` e `/(auth)/register` são removidas; não há nova rota de auth

## Impact

- `src/app/index.tsx` — modificado (botões substituídos por Google Sign-In)
- `src/app/(auth)/login.tsx` — removido
- `src/app/(auth)/register.tsx` — removido
- `src/stores/useAuthStore.ts` — refatorado para OAuth
- `src/lib/supabase.ts` — configuração de OAuth (deep link / redirect URL)
- `app.json` — scheme de deep link necessário para OAuth callback
- Dependências: `expo-web-browser`, `expo-auth-session` (para OAuth flow no Expo)
