## Requirements

### Requirement: Check-in diário pode ser submetido uma vez por dia
O usuário SHALL poder preencher e submeter um check-in diário composto por 3 escalas de 1 a 5 (Disposição, Sono, Foco). O sistema SHALL bloquear nova submissão se já houver check-in no dia corrente (data local `YYYY-MM-DD`). Após submissão, o formulário SHALL exibir confirmação e desabilitar novo envio até meia-noite local.

#### Scenario: Primeiro check-in do dia
- **WHEN** o usuário acessa a tela de Evolução sem check-in no dia atual
- **THEN** o `WeeklyCheckinCard` exibe as 3 escalas habilitadas e o botão "Registrar"

#### Scenario: Check-in já realizado hoje
- **WHEN** o usuário acessa a tela de Evolução e já há check-in no dia corrente
- **THEN** o `WeeklyCheckinCard` exibe os valores submetidos em modo read-only com texto "Check-in de hoje realizado ✓"

#### Scenario: Submissão válida
- **WHEN** o usuário define valores para as 3 escalas e toca "Registrar"
- **THEN** o check-in é salvo no store Zustand, o gráfico e o insight atualizam imediatamente, o formulário passa para modo read-only **sem necessidade de reload ou navegação**, e o botão "Registrar" desaparece

#### Scenario: Submissão com escala não preenchida
- **WHEN** o usuário toca "Registrar" sem definir todas as 3 escalas
- **THEN** o botão permanece desabilitado (só habilita quando todas as 3 escalas têm valor selecionado)

---

### Requirement: Gráfico de linha exibe histórico de até 30 entradas diárias
O sistema SHALL renderizar um gráfico de linha (`EvolutionChart`) mostrando o score médio ((Disposição + Sono + Foco) / 3) de cada check-in diário. O eixo X SHALL mostrar o label de data abreviado no formato `DD/MM` (ex: "15/04"). O eixo Y SHALL variar de 1 a 5. A linha SHALL usar a cor `primary-500` (#3D8B3E).

#### Scenario: Histórico com dados
- **WHEN** há ao menos 1 check-in registrado
- **THEN** o gráfico exibe um ponto/linha para cada check-in, ordenado cronologicamente

#### Scenario: Sem histórico
- **WHEN** não há nenhum check-in registrado
- **THEN** o gráfico é substituído por um banner de onboarding com texto "Faça seu primeiro check-in para ver sua evolução!"

#### Scenario: Histórico com mais de 30 entradas
- **WHEN** há mais de 30 check-ins registrados
- **THEN** o gráfico exibe apenas as 30 entradas mais recentes

---

### Requirement: Insight textual compara check-in mais recente com o anterior
O sistema SHALL exibir um `InsightBanner` com texto gerado a partir da comparação do score médio do check-in mais recente com o anterior. O insight SHALL usar linguagem positiva e encorajadora.

#### Scenario: Melhora entre check-ins
- **WHEN** o score médio do check-in mais recente é maior que o do anterior
- **THEN** o InsightBanner exibe "Sua disposição geral melhorou X% esta semana. Continue assim!" (onde X é o percentual de melhora arredondado)

#### Scenario: Queda entre check-ins
- **WHEN** o score médio do check-in mais recente é menor que o do anterior
- **THEN** o InsightBanner exibe "Esta semana foi mais desafiadora. Lembre-se de cuidar do seu mix!"

#### Scenario: Empate ou sem check-in anterior
- **WHEN** há apenas 1 check-in registrado ou o score é idêntico
- **THEN** o InsightBanner exibe "Continue registrando seu check-in para ver tendências de evolução."

---

### Requirement: Store de progresso persiste check-ins localmente
O `useProgressStore` (Zustand) SHALL armazenar a lista de check-ins com campos `{ id, date (YYYY-MM-DD), energy_score, sleep_score, focus_score, created_at }`. O store SHALL expor: `checkins[]`, `addCheckin(data)`, `getTodayCheckin()`.

#### Scenario: Adicionar check-in
- **WHEN** `addCheckin` é chamado com dados válidos
- **THEN** o check-in é adicionado à lista com `date` no formato `YYYY-MM-DD` (data local) e `created_at` como timestamp

#### Scenario: Recuperar check-in do dia corrente
- **WHEN** `getTodayCheckin()` é chamado
- **THEN** retorna o check-in cuja `date` coincide com a data local de hoje, ou `undefined` se não houver

---

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
