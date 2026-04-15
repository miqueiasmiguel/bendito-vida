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

### Decisão 1: `expo-auth-session` + `expo-web-browser` + PKCE ao invés de Supabase JS nativo com implicit flow

O Supabase JS SDK (`supabase.auth.signInWithOAuth`) funciona em browsers mas não gerencia o deep link callback no Expo. A abordagem correta para Expo é PKCE flow (`flowType: 'pkce'` em `createClient`):

1. Usar `makeRedirectUri` do `expo-auth-session` para gerar a URL de callback
2. Chamar `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`
3. Abrir a URL retornada com `WebBrowser.openAuthSessionAsync`
4. **Android**: o OS entrega o deep link como intent de navegação ao Expo Router, que roteia para `src/app/auth/callback.tsx`. A rota extrai `?code=` via `useLocalSearchParams` e chama `supabase.auth.exchangeCodeForSession(code)`.
5. **iOS**: `openAuthSessionAsync` captura o redirect in-app (SFSafariViewController) e retorna `{ type: 'success', url }`. O store extrai `?code=` da URL e chama `supabase.auth.exchangeCodeForSession(code)`.

**Por que PKCE, não implicit?** Com implicit flow, os tokens chegam no hash da URL (`#access_token=...`). O Expo Router descarta o hash ao processar deep links, tornando os tokens inacessíveis na rota de callback. Com PKCE, o código de autorização chega em `?code=` (query param), que o Expo Router preserva e expõe via `useLocalSearchParams`.

**Por que `auth/callback.tsx` e não `(auth)/callback.tsx`?** Em Expo Router, parênteses indicam route groups — o segmento não aparece na URL. `(auth)/callback.tsx` resolve para `/callback`, não `/auth/callback`. Como o deep link configurado é `bendito-vida://auth/callback`, a rota precisa estar em `src/app/auth/callback.tsx` (diretório `auth` real).

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
2. Adicionar `scheme` ao `app.json` + rebuild do dev build para registrar o intent filter no AndroidManifest
3. Configurar `flowType: 'pkce'` em `src/lib/supabase.ts`
4. Criar `src/app/auth/callback.tsx` (rota real `/auth/callback`, não dentro do route group `(auth)`)
5. Refatorar `useAuthStore` (remover email/senha, adicionar `signInWithGoogle` com `exchangeCodeForSession` no caminho iOS)
6. Modificar `index.tsx` (Welcome) com botão "Entrar com Google"
7. Remover `login.tsx` e `register.tsx`

**Rollback**: Reverter commits. Não há migração de banco necessária — Supabase gerencia sessões OAuth automaticamente.
