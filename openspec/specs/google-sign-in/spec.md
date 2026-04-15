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
