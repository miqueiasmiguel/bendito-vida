## MODIFIED Requirements

### Requirement: Check-in diário pode ser submetido uma vez por dia
O usuário SHALL poder preencher e submeter um check-in diário composto por 3 escalas de 1 a 5 (Disposição, Sono, Foco). O sistema SHALL bloquear nova submissão se já houver check-in na data corrente (dia calendário local). Após submissão, o formulário SHALL exibir confirmação e desabilitar o botão de envio até o dia seguinte.

#### Scenario: Primeiro check-in do dia
- **WHEN** o usuário acessa a tela de Evolução sem check-in na data atual
- **THEN** o `DailyCheckinCard` exibe as 3 escalas habilitadas e o botão "Registrar" ativo

#### Scenario: Check-in já realizado hoje
- **WHEN** o usuário acessa a tela de Evolução e já há check-in para a data atual (YYYY-MM-DD local)
- **THEN** o `DailyCheckinCard` exibe os valores submetidos em modo read-only com texto "Check-in de hoje realizado ✓" e o botão "Registrar" desabilitado

#### Scenario: Submissão válida
- **WHEN** o usuário define valores para as 3 escalas e toca "Registrar"
- **THEN** o check-in é salvo no store Zustand com a data local (`YYYY-MM-DD`), o gráfico e o insight atualizam imediatamente, e o botão passa para estado desabilitado

#### Scenario: Submissão com escala não preenchida
- **WHEN** o usuário toca "Registrar" sem definir todas as 3 escalas
- **THEN** o botão permanece desabilitado (só habilita quando todas as 3 escalas têm valor selecionado e não há check-in do dia)

---

### Requirement: Gráfico de linha exibe histórico de até 30 check-ins
O sistema SHALL renderizar um gráfico de linha (`EvolutionChart`) mostrando o score médio ((Disposição + Sono + Foco) / 3) de cada check-in registrado. O eixo X SHALL mostrar o label de data abreviado (ex: "15/04"). O eixo Y SHALL variar de 1 a 5. A linha SHALL usar a cor `primary-500` (#3D8B3E).

#### Scenario: Histórico com dados
- **WHEN** há ao menos 1 check-in registrado
- **THEN** o gráfico exibe um ponto/linha para cada check-in, ordenado cronologicamente por data

#### Scenario: Sem histórico
- **WHEN** não há nenhum check-in registrado
- **THEN** o gráfico é substituído por um banner de onboarding com texto "Faça seu primeiro check-in para ver sua evolução!"

#### Scenario: Histórico com mais de 30 check-ins
- **WHEN** há mais de 30 check-ins registrados
- **THEN** o gráfico exibe apenas os 30 check-ins mais recentes

---

### Requirement: Store de progresso persiste check-ins diários localmente
O `useProgressStore` (Zustand) SHALL armazenar a lista de check-ins com campos `{ id, date (string YYYY-MM-DD), energyScore, sleepScore, focusScore, createdAt }`. O store SHALL expor: `checkins[]`, `addCheckin(data)`, `getTodayCheckin()`.

#### Scenario: Adicionar check-in
- **WHEN** `addCheckin` é chamado com dados válidos
- **THEN** o check-in é adicionado à lista com `date` no formato `YYYY-MM-DD` (data local) e `createdAt` como timestamp

#### Scenario: Recuperar check-in do dia corrente
- **WHEN** `getTodayCheckin()` é chamado
- **THEN** retorna o check-in cuja `date` coincide com a data local de hoje (`YYYY-MM-DD`), ou `undefined` se não houver
