## MODIFIED Requirements

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
