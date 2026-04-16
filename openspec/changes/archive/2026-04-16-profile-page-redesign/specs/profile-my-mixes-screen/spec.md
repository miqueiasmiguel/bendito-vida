## ADDED Requirements

### Requirement: Listar mixes salvos do usuário
A tela "Meus Mixes" (`/(tabs)/profile/my-mixes`) SHALL buscar e exibir os mixes salvos via `useProfileStore`, renderizando cada item com `SavedMixCard`. O botão de voltar do header SHALL retornar para o hub de Perfil.

#### Scenario: Usuário tem mixes salvos
- **WHEN** o usuário navega para "Meus Mixes" e o fetch conclui com sucesso
- **THEN** o sistema exibe uma lista com `SavedMixCard` para cada mix, ordenados por `created_at desc`

#### Scenario: Nenhum mix salvo
- **WHEN** a query retorna lista vazia
- **THEN** o sistema exibe a mensagem "Você ainda não salvou nenhum mix." e um botão "Criar meu Mix" que navega para `/(tabs)/simulator`

#### Scenario: Carregando mixes
- **WHEN** o fetch está em andamento
- **THEN** o sistema exibe 3 skeleton loaders no lugar da lista

#### Scenario: Erro no fetch
- **WHEN** a query ao Supabase falha
- **THEN** o sistema exibe a mensagem "Não foi possível carregar seus mixes" sem travar a tela

### Requirement: Header da tela de Meus Mixes
A tela SHALL exibir um header com título "Meus Mixes" e botão de voltar (`<ChevronLeft />` Lucide) que executa `router.back()`.

#### Scenario: Navegação de volta
- **WHEN** o usuário toca o botão de voltar
- **THEN** o sistema retorna para `/(tabs)/profile`
