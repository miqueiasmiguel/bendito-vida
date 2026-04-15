## ADDED Requirements

### Requirement: Histórico de check-ins carregado do Supabase na inicialização das tabs
Ao inicializar as tabs com um usuário autenticado, o sistema SHALL chamar `fetchCheckins(userId)` automaticamente para popular `useProgressStore.checkins` com os dados do Supabase. Isso garante que o gráfico de evolução e o estado do check-in de hoje reflitam os dados reais desde o primeiro render, sem necessidade de interação do usuário.

#### Scenario: App reinicia com histórico de check-ins no Supabase
- **WHEN** o usuário abre o app com sessão ativa e há check-ins registrados no Supabase
- **THEN** o gráfico de evolução exibe o histórico correto e o WeeklyCheckinCard mostra "Feito hoje ✓" (ou formulário habilitado) conforme o estado real do banco

#### Scenario: Check-in de hoje já realizado — app reiniciado
- **WHEN** o usuário realizou um check-in hoje, fecha o app e reabre
- **THEN** o WeeklyCheckinCard na tela Home exibe "Feito hoje ✓" e o formulário completo na tela Evolução está em modo read-only com os valores submetidos

#### Scenario: Usuário sem check-ins no Supabase
- **WHEN** o usuário abre o app pela primeira vez (sem check-ins registrados)
- **THEN** `fetchCheckins` retorna lista vazia, o gráfico exibe o estado vazio ("Faça seu primeiro check-in")
