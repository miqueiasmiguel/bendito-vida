## ADDED Requirements

### Requirement: Exibir identidade do usuário
A tela de Perfil SHALL exibir um avatar circular com a inicial do nome do usuário, o nome completo e a data de cadastro formatada ("Membro desde mês/ano").

#### Scenario: Usuário autenticado com nome
- **WHEN** o usuário navega para a aba Perfil
- **THEN** o sistema exibe a inicial do nome em avatar circular com fundo `primary-700`, o nome completo e a data de cadastro no formato "Membro desde [mês] de [ano]"

#### Scenario: Nome ausente no perfil
- **WHEN** o campo `name` está vazio ou nulo
- **THEN** o sistema exibe "?" no avatar e "Usuário" como nome

---

### Requirement: Resumo do Mapa Bioativo
A tela de Perfil SHALL exibir um card "Meu Mapa Bioativo" com os 3 nutrientes prioritários identificados no quiz, cada um com ícone Lucide, nome e barra de prioridade.

#### Scenario: Quiz completado
- **WHEN** `bioactiveProfile` está disponível no `useQuizStore`
- **THEN** o card exibe as 3 tags de nutrientes com ícone, nome legível e barra visual de intensidade

#### Scenario: Quiz não completado
- **WHEN** `bioactiveProfile` é `null` ou está vazio
- **THEN** o card exibe a mensagem "Complete o quiz para ver seu Mapa Bioativo" e um botão "Fazer Quiz" que navega para `/(onboarding)/quiz`

---

### Requirement: Listar mixes salvos
A tela de Perfil SHALL buscar e exibir os mixes salvos do usuário (tabela `mixes` do Supabase), ordenados do mais recente para o mais antigo, limitado a 10 itens.

#### Scenario: Usuário tem mixes salvos
- **WHEN** a tela monta e o fetch retorna mixes
- **THEN** o sistema exibe cada mix em um `SavedMixCard` com nome, data de criação, lista resumida de ingredientes (máx. 3 nomes + "+N" se houver mais) e sumário nutricional (calorias e proteínas)

#### Scenario: Nenhum mix salvo
- **WHEN** a query retorna lista vazia
- **THEN** o sistema exibe a mensagem "Você ainda não salvou nenhum mix." e um botão "Criar meu Mix" que navega para `/(tabs)/simulator`

#### Scenario: Erro no fetch de mixes
- **WHEN** a query ao Supabase falha
- **THEN** o sistema exibe uma mensagem de erro discreta ("Não foi possível carregar seus mixes") sem travar a tela

#### Scenario: Carregando mixes
- **WHEN** o fetch está em andamento
- **THEN** o sistema exibe skeleton loaders (3 cards) no lugar da lista

---

### Requirement: Logout do usuário
A tela de Perfil SHALL oferecer um botão "Sair da conta" na seção de configurações que executa o logout e redireciona para a tela de login.

#### Scenario: Logout bem-sucedido
- **WHEN** o usuário toca "Sair da conta" e confirma
- **THEN** o sistema chama `useAuthStore.signOut()`, limpa o estado local e redireciona para `/(auth)/login` via `router.replace`

#### Scenario: Logout sem conexão
- **WHEN** `signOut()` é chamado sem rede disponível
- **THEN** o sistema ainda limpa a sessão local do Supabase e redireciona para login

---

### Requirement: Store de perfil (`useProfileStore`)
O sistema SHALL disponibilizar um store Zustand `useProfileStore` que encapsula fetch de `profiles` e `mixes` do Supabase, expondo `profile`, `mixes`, `isLoading` e `error`.

#### Scenario: Fetch bem-sucedido
- **WHEN** `fetchProfile(userId)` é chamado
- **THEN** o store popula `profile` com dados de `profiles` e `mixes` com dados da tabela `mixes` ordenados por `created_at desc`

#### Scenario: Fetch com erro
- **WHEN** a query ao Supabase retorna erro
- **THEN** o store define `error` com a mensagem e mantém `mixes` como array vazio
