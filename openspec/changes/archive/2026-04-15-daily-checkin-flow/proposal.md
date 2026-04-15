## Why

O check-in semanal limita a frequência de dados de bem-estar coletados e não reflete o comportamento diário do usuário. Mudar para check-in diário aumenta a granularidade do histórico, permite insights mais precisos e reforça o hábito de auto-monitoramento.

## What Changes

- O check-in passa de frequência **semanal** para **diária** (um check-in por dia por usuário)
- Após o usuário completar o check-in do dia, o botão de submissão é **desabilitado** até o dia seguinte
- O card/botão de check-in é **removido da tela Home** — o check-in passa a ser acessado exclusivamente pela tela de Progresso
- A tabela no banco de dados muda de `weekly_checkins` (key `week` ISO) para `daily_checkins` (key `date` ISO `YYYY-MM-DD`)
- O store `useProgressStore` atualiza os campos e a lógica de bloqueio para granularidade diária

## Capabilities

### New Capabilities

_Nenhuma capability nova — apenas modificações em capabilities existentes._

### Modified Capabilities

- `progress-dashboard`: check-in muda de semanal para diário; botão desabilitado após submissão do dia; gráfico exibe pontos por dia
- `home-screen`: remover card "Check-in da semana" da tela Home
- `database-schema`: substituir tabela `weekly_checkins` por `daily_checkins` com chave `date` (`YYYY-MM-DD`) e constraint `UNIQUE(user_id, date)`

## Impact

- `src/stores/useProgressStore.ts` — atualizar campos (`week` → `date`), `getCurrentWeekCheckin()` → `getTodayCheckin()`, lógica de bloqueio por dia
- `src/stores/__tests__/useProgressStore.test.ts` — atualizar testes para granularidade diária
- `src/app/(tabs)/progress.tsx` — ajustar UI do formulário de check-in (lógica de disable do botão)
- `src/app/(tabs)/home.tsx` (ou equivalente) — remover componente/card de check-in
- `supabase/migrations/` — nova migration criando `daily_checkins` e opcionalmente dropando `weekly_checkins`
- `openspec/specs/database-schema/spec.md` — atualizar requirement da tabela
