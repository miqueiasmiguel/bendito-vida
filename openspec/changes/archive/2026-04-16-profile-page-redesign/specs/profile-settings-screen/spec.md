## ADDED Requirements

### Requirement: Editar nome de exibição
A tela "Configurações" (`/(tabs)/profile/settings`) SHALL permitir ao usuário alterar seu nome de exibição via um campo de texto que persiste o valor na tabela `profiles` do Supabase usando `useProfileStore.updateName()`.

#### Scenario: Salvar nome com sucesso
- **WHEN** o usuário edita o campo de nome e toca "Salvar"
- **THEN** o sistema chama `updateName(userId, name)`, exibe feedback visual de sucesso ("Nome atualizado!") e atualiza o estado local do store

#### Scenario: Campo de nome vazio
- **WHEN** o usuário limpa o campo de nome e toca "Salvar"
- **THEN** o sistema exibe uma mensagem de validação inline ("O nome não pode ser vazio") e não chama `updateName`

#### Scenario: Erro ao salvar nome
- **WHEN** `updateName` retorna erro (sem conexão ou erro Supabase)
- **THEN** o sistema exibe uma mensagem de erro ("Não foi possível salvar. Tente novamente.") sem navegar

#### Scenario: Campo pré-preenchido
- **WHEN** o usuário abre a tela de Configurações
- **THEN** o campo de nome exibe o nome atual do usuário (`useAuthStore.user.name`)

### Requirement: Logout via Configurações
A tela "Configurações" SHALL conter o botão "Sair da conta" (variante secundária) que executa logout e redireciona para a Welcome screen.

#### Scenario: Logout bem-sucedido
- **WHEN** o usuário toca "Sair da conta"
- **THEN** o sistema chama `useAuthStore.signOut()`, limpa o estado local e redireciona para `/` via `router.replace('/')`

### Requirement: Header da tela de Configurações
A tela SHALL exibir um header com título "Configurações" e botão de voltar (`<ChevronLeft />` Lucide) que executa `router.back()`.

#### Scenario: Navegação de volta
- **WHEN** o usuário toca o botão de voltar
- **THEN** o sistema retorna para `/(tabs)/profile`

### Requirement: `updateName` no store de perfil
O `useProfileStore` SHALL expor `updateName(userId: string, name: string): Promise<void>` que executa `supabase.from('profiles').update({ name }).eq('id', userId)` e atualiza `profile.name` no estado local em caso de sucesso.

#### Scenario: Atualização bem-sucedida
- **WHEN** `updateName` é chamado com userId e name válidos
- **THEN** o Supabase é atualizado e o estado `profile.name` do store reflete o novo valor

#### Scenario: Atualização com erro
- **WHEN** `updateName` é chamado e o Supabase retorna erro
- **THEN** o store mantém o valor anterior de `profile.name` e a Promise é rejeitada com o erro
