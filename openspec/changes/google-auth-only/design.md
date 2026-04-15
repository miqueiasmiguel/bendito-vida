## Context

O app atualmente possui duas telas de autenticação separadas (`login.tsx` e `register.tsx`) baseadas em email/senha via Supabase, além de uma tela Welcome (`index.tsx`) com botões "Começar" (→ quiz) e "Já tenho conta" (→ login). O objetivo é consolidar tudo: a tela Welcome passa a ter um único botão "Entrar com Google" que cobre novos e existentes usuários. Após autenticação, o app decide para onde ir (quiz para novos, home para existentes).

A autenticação Google via Supabase no Expo usa o pacote `expo-auth-session` junto com `expo-web-browser` para abrir o provider OAuth em um browser in-app e capturar o callback via deep link.

## Goals / Non-Goals

**Goals:**
- Modificar `index.tsx` (Welcome) para conter o botão "Entrar com Google" no lugar dos botões atuais
- Implementar o fluxo completo: iniciar OAuth → browser → callback → sessão Supabase
- Configurar deep link (scheme) no `app.json` para captura do callback
- Atualizar `useAuthStore` para refletir o novo fluxo (sem email/senha)
- Remover `login.tsx` e `register.tsx`

**Non-Goals:**
- Criar nova tela de sign-in (`/(auth)/sign-in.tsx` não será criada)
- Manter compatibilidade com email/senha (removido completamente)
- Implementar outros providers OAuth (Apple, Facebook)
- Implementar sign-out (já existe ou é responsabilidade de outra tela)

## Decisions

### Decisão 1: `expo-auth-session` + `expo-web-browser` ao invés de Supabase JS nativo

O Supabase JS SDK (`supabase.auth.signInWithOAuth`) funciona em browsers mas não gerencia o deep link callback no Expo. A abordagem correta para Expo é:

1. Usar `makeRedirectUri` do `expo-auth-session` para gerar a URL de callback
2. Chamar `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`
3. Abrir a URL retornada com `WebBrowser.openAuthSessionAsync`
4. Capturar o fragment da URL de retorno e trocar pelo token com `supabase.auth.setSession`

**Alternativa considerada**: `@react-native-google-signin/google-signin` — exige configuração nativa (Android/iOS) e não funciona com Expo Go/dev-client sem build customizado. Mais complexidade sem benefício para o MVP.

### Decisão 2: Scheme de deep link `bendito-vida`

O `app.json` precisa de `scheme: "bendito-vida"` para que o OAuth callback `bendito-vida://auth/callback` seja capturado pelo app. Isso é necessário para builds standalone (EAS Build).

Em desenvolvimento com Expo Go/dev-client, `makeRedirectUri` usa o scheme do Expo automaticamente.

### Decisão 3: Remover completamente `login.tsx` e `register.tsx`

Sem backward compatibility — as rotas antigas serão deletadas. Referências a `/(auth)/login` ou `/(auth)/register` no código de navegação serão removidas (não há rota de substituição — o Google Sign-In é acionado diretamente da tela Welcome).

## Risks / Trade-offs

- **[Risco] Configuração do Google OAuth no Supabase Dashboard** → O desenvolvedor precisa adicionar o Client ID do Google no Supabase e configurar as URLs de redirect autorizadas. Documentar no README ou `.env.example`.
- **[Risco] Callback em builds de produção requer scheme correto** → O scheme `bendito-vida` deve estar registrado no Google Cloud Console como redirect URI. Mitigação: documentar os URIs necessários.
- **[Trade-off] Sem fallback de email/senha** → Se o usuário não tiver conta Google ou estiver offline, não há login. Aceitável para o MVP de demonstração.

## Migration Plan

1. Instalar dependências: `expo-auth-session`, `expo-web-browser` (verificar se já estão no projeto)
2. Adicionar `scheme` ao `app.json`
3. Criar `src/app/(auth)/sign-in.tsx`
4. Refatorar `useAuthStore` (remover email/senha, adicionar `signInWithGoogle`)
5. Remover `login.tsx` e `register.tsx`
6. Atualizar referências de navegação (`/(auth)/login` → `/(auth)/sign-in`)
7. Atualizar spec `app-navigation` (rota `login`/`register` → `sign-in`)

**Rollback**: Reverter commit. Não há migração de banco necessária — Supabase gerencia sessões OAuth automaticamente.
