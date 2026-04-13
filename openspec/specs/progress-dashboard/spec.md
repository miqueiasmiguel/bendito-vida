## ADDED Requirements

### Requirement: Check-in semanal pode ser submetido uma vez por semana
O usuário SHALL poder preencher e submeter um check-in semanal composto por 3 escalas de 1 a 5 (Disposição, Sono, Foco). O sistema SHALL bloquear nova submissão se já houver check-in na semana ISO corrente (segunda a domingo). Após submissão, o formulário SHALL exibir confirmação e desabilitar novo envio até a próxima semana.

#### Scenario: Primeiro check-in da semana
- **WHEN** o usuário acessa a tela de Evolução sem check-in na semana atual
- **THEN** o `WeeklyCheckinCard` exibe as 3 escalas habilitadas e o botão "Registrar"

#### Scenario: Check-in já realizado na semana
- **WHEN** o usuário acessa a tela de Evolução e já há check-in na semana ISO corrente
- **THEN** o `WeeklyCheckinCard` exibe os valores submetidos em modo read-only com texto "Check-in da semana realizado ✓"

#### Scenario: Submissão válida
- **WHEN** o usuário define valores para as 3 escalas e toca "Registrar"
- **THEN** o check-in é salvo no store Zustand, o gráfico e o insight atualizam imediatamente, e o formulário passa para modo read-only

#### Scenario: Submissão com escala não preenchida
- **WHEN** o usuário toca "Registrar" sem definir todas as 3 escalas
- **THEN** o botão permanece desabilitado (só habilita quando todas as 3 escalas têm valor selecionado)

---

### Requirement: Gráfico de linha exibe histórico de até 8 semanas
O sistema SHALL renderizar um gráfico de linha (`EvolutionChart`) mostrando o score médio ((Disposição + Sono + Foco) / 3) de cada semana. O eixo X SHALL mostrar o label de semana (ex: "S1", "S2"). O eixo Y SHALL variar de 1 a 5. A linha SHALL usar a cor `primary-500` (#3D8B3E).

#### Scenario: Histórico com dados
- **WHEN** há ao menos 1 check-in registrado
- **THEN** o gráfico exibe um ponto/linha para cada semana com check-in, ordenado cronologicamente

#### Scenario: Sem histórico
- **WHEN** não há nenhum check-in registrado
- **THEN** o gráfico é substituído por um banner de onboarding com texto "Faça seu primeiro check-in para ver sua evolução!"

#### Scenario: Histórico com mais de 8 semanas
- **WHEN** há mais de 8 check-ins registrados
- **THEN** o gráfico exibe apenas as 8 semanas mais recentes

---

### Requirement: Insight textual compara semana atual com anterior
O sistema SHALL exibir um `InsightBanner` com texto gerado a partir da comparação do score médio da semana mais recente com o da semana anterior. O insight SHALL usar linguagem positiva e encorajadora.

#### Scenario: Melhora entre semanas
- **WHEN** o score médio da semana mais recente é maior que o da semana anterior
- **THEN** o InsightBanner exibe "Sua disposição geral melhorou X% esta semana. Continue assim!" (onde X é o percentual de melhora arredondado)

#### Scenario: Queda entre semanas
- **WHEN** o score médio da semana mais recente é menor que o da semana anterior
- **THEN** o InsightBanner exibe "Esta semana foi mais desafiadora. Lembre-se de cuidar do seu mix!"

#### Scenario: Empate ou sem semana anterior
- **WHEN** há apenas 1 semana de dados ou o score é idêntico
- **THEN** o InsightBanner exibe "Continue registrando seu check-in para ver tendências de evolução."

---

### Requirement: Store de progresso persiste check-ins localmente
O `useProgressStore` (Zustand) SHALL armazenar a lista de check-ins com campos `{ id, week (ISO string YYYY-WNN), energyScore, sleepScore, focusScore, createdAt }`. O store SHALL expor: `checkins[]`, `addCheckin(data)`, `getCurrentWeekCheckin()`.

#### Scenario: Adicionar check-in
- **WHEN** `addCheckin` é chamado com dados válidos
- **THEN** o check-in é adicionado à lista com `week` no formato ISO (ex: "2026-W15") e `createdAt` como timestamp

#### Scenario: Recuperar check-in da semana corrente
- **WHEN** `getCurrentWeekCheckin()` é chamado
- **THEN** retorna o check-in cuja semana ISO coincide com a semana atual, ou `undefined` se não houver
