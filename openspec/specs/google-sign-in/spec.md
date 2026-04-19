## Requirements

### Requirement: Tela Welcome com botão Google Sign-In
A tela Welcome (`src/app/index.tsx`) SHALL exibir um único botão "Entrar com Google" no lugar dos botões "Começar" e "Já tenho conta". Não SHALL existir formulários de email, senha ou telas de login/cadastro separadas.

#### Scenario: Tela renderiza com botão Google
- **WHEN** o usuário acessa a tela Welcome (`/`)
- **THEN** a tela exibe logo do app, texto de boas-vindas e um botão "Entrar com Google" visível, sem botões "Começar" ou "Já tenho conta"

#### Scenario: Botão respeita touch area mínima
- **WHEN** o botão "Entrar com Google" é renderizado
- **THEN** sua área de toque SHALL ser de no mínimo 44x44 pontos

### Requirement: Fluxo OAuth Google via Supabase
Ao pressionar "Entrar com Google", o app SHALL iniciar o fluxo OAuth abrindo o browser in-app (`expo-web-browser`) com a URL de autorização do Google gerada pelo Supabase. Após autenticação bem-sucedida, o app SHALL capturar o callback e estabelecer a sessão Supabase.

#### Scenario: Usuário autentica com sucesso
- **WHEN** o usuário pressiona "Entrar com Google" e conclui a autenticação no browser
- **THEN** o browser fecha, a sessão Supabase é estabelecida e o usuário é redirecionado para `/(tabs)/home`

#### Scenario: Usuário cancela autenticação
- **WHEN** o usuário abre o browser OAuth e fecha sem autenticar
- **THEN** o browser fecha, nenhuma sessão é criada e o usuário permanece na tela Welcome

#### Scenario: Erro de autenticação
- **WHEN** ocorre erro durante o fluxo OAuth (rede, credenciais inválidas)
- **THEN** o app exibe mensagem de erro ao usuário e permite nova tentativa

### Requirement: Troca de código PKCE por plataforma
O exchange do código de autorização (`exchangeCodeForSession`) SHALL ocorrer em um único ponto por plataforma para evitar dupla tentativa que consome o code verifier PKCE:

- **iOS**: `signInWithGoogle` faz o exchange via `result.url` retornado pelo `SFSafariViewController` (`openAuthSessionAsync` com `result.type === 'success'`).
- **Android**: o Custom Tab entrega o deep link como intent ao SO e `openAuthSessionAsync` pode retornar `result.type === 'success'` simultaneamente. O exchange SHALL ser feito exclusivamente pelo route handler `src/app/auth/callback.tsx` via deep link. O branch `result.type === 'success'` em `signInWithGoogle` SHALL ser ignorado no Android (`Platform.OS === 'ios'` guard).

> **Contexto:** sem o guard, ambos os caminhos correm em paralelo. O callback ganha a corrida, consome o verifier; o `signInWithGoogle` falha com "PKCE code verifier not found in storage".

#### Scenario: Login funciona após logout no Android
- **WHEN** o usuário faz logout e inicia um novo login com Google no Android
- **THEN** o exchange ocorre apenas via `/auth/callback`, a sessão é estabelecida e o usuário é redirecionado para `/(tabs)/home` sem erro

### Requirement: Polyfill WebCrypto para PKCE SHA-256
O ambiente React Native não expõe `crypto.getRandomValues` nem `crypto.subtle`. O app SHALL instalar um polyfill em `src/lib/crypto-polyfill.ts` — importado como primeiro import em `src/app/_layout.tsx` — que liga essas APIs ao `expo-crypto`, garantindo que o Supabase use SHA-256 (e não `plain`) para o code challenge PKCE.

#### Scenario: PKCE usa SHA-256
- **WHEN** o fluxo OAuth é iniciado
- **THEN** nenhum warning "WebCrypto API is not supported... defaulting to plain" aparece nos logs

### Requirement: Estado de loading durante OAuth
A UI SHALL exibir indicador de carregamento enquanto o fluxo OAuth estiver em andamento, desabilitando o botão para evitar múltiplas requisições.

#### Scenario: Loading ativo durante fluxo
- **WHEN** o usuário pressiona "Entrar com Google" e o browser está aberto
- **THEN** o botão exibe estado de loading e está desabilitado para novos toques

#### Scenario: Loading encerra após resposta
- **WHEN** o browser OAuth fecha (sucesso ou cancelamento)
- **THEN** o indicador de loading desaparece e o botão volta ao estado normal (se não houve sucesso)

### Requirement: Persistência de sessão
O `useAuthStore` SHALL armazenar a sessão Supabase retornada pelo OAuth e expor método `signInWithGoogle`. Métodos de email/senha SHALL ser removidos do store.

#### Scenario: Sessão persiste entre restarts
- **WHEN** o usuário autentica com Google e reinicia o app
- **THEN** o Supabase recupera a sessão automaticamente e o usuário é redirecionado para `/(tabs)/home` sem precisar autenticar novamente

#### Scenario: Store não expõe métodos de email/senha
- **WHEN** outros componentes importam `useAuthStore`
- **THEN** não existem métodos `signIn`, `signUp`, `signInWithEmail` ou similares no store
