## MODIFIED Requirements

### Requirement: Listar mixes salvos
A tela de Perfil SHALL buscar e exibir os mixes salvos do usuário na tabela `mixes` do Supabase (definida em `0001_initial_schema.sql`), ordenados por `created_at desc`, limitado a 10 itens. A query SHALL usar o índice `(user_id, created_at DESC)` implicitamente ao filtrar por `user_id = auth.uid()`.

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

### Requirement: Store de perfil (`useProfileStore`)
O sistema SHALL disponibilizar um store Zustand `useProfileStore` que encapsula fetch de `profiles` e `mixes` do Supabase (tabelas definidas em `0001_initial_schema.sql`), expondo `profile`, `mixes`, `isLoading` e `error`. O tipo `Profile` SHALL incluir os campos: `id`, `name`, `onboarding_completed`, `bioactive_profile`, `created_at`, `updated_at`. O tipo `Mix` SHALL incluir: `id`, `user_id`, `name`, `ingredients` (string[]), `nutrition` (objeto com `calories`, `fiber`, `protein`, `omega3`), `created_at`.

#### Scenario: Fetch bem-sucedido
- **WHEN** `fetchProfile(userId)` é chamado
- **THEN** o store popula `profile` com dados de `profiles` e `mixes` com dados da tabela `mixes` ordenados por `created_at desc`

#### Scenario: Fetch com erro
- **WHEN** a query ao Supabase retorna erro
- **THEN** o store define `error` com a mensagem e mantém `mixes` como array vazio
