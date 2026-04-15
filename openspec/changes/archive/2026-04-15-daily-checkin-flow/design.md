## Context

O check-in atual é semanal: o `useProgressStore` identifica registros pela chave `week` (ISO `YYYY-WNN`) e a tabela `weekly_checkins` usa `UNIQUE(user_id, week)`. A tela Home exibe um card estático "Check-in da semana". A tela Progress contém o formulário funcional.

A mudança envolve três camadas: banco de dados (nova tabela `daily_checkins`), store Zustand (trocar semana por data), e UI (remover card da Home, desabilitar botão na Progress após submissão do dia).

## Goals / Non-Goals

**Goals:**
- Permitir um check-in por dia por usuário
- Desabilitar o botão de submissão após o check-in do dia ser registrado, até meia-noite
- Remover o card de check-in da tela Home
- Manter o gráfico de evolução funcional (agora com pontos diários)
- Garantir consistência entre store local e banco Supabase

**Non-Goals:**
- Migração de dados históricos de `weekly_checkins` para `daily_checkins` (MVP: dados semanais anteriores são descartados)
- Notificações push para lembrar o check-in diário
- Sincronização offline/online avançada

## Decisions

### 1. Chave diária como `date` (`YYYY-MM-DD`) em vez de `week`

**Decisão:** trocar o campo `week` (ISO `YYYY-WNN`) por `date` (ISO `YYYY-MM-DD`) tanto no store quanto no banco.

**Rationale:** `date` é mais simples de comparar (`=== today`), não exige biblioteca de cálculo de semana ISO, e é diretamente convertível de `new Date().toISOString().slice(0,10)`.

**Alternativa descartada:** manter `week` e limitar a um check-in por dia via constraint adicional — desnecessariamente complexo.

### 2. Nova tabela `daily_checkins` em vez de ALTER da `weekly_checkins`

**Decisão:** criar a tabela `daily_checkins` diretamente na migration `0001_initial_schema.sql` (que já substitui a migration anterior), removendo `weekly_checkins`.

**Rationale:** o projeto está em MVP pré-lançamento sem dados reais em produção, então não há risco de perda de dados. Uma migration limpa é preferível a um ALTER + rename.

### 3. Lógica de "botão desabilitado" no componente UI, guiada pelo store

**Decisão:** `useProgressStore` expõe `getTodayCheckin()` (análogo ao `getCurrentWeekCheckin()`). O componente de check-in lê esse valor e desabilita o botão quando não é `undefined`.

**Rationale:** separa responsabilidade — store sabe o estado, UI reage. Sem lógica de data espalhada por componentes.

### 4. Remoção completa do card da Home (não apenas ocultar)

**Decisão:** remover o `Requirement: Card de Check-in semanal (placeholder)` da spec da Home e deletar o código correspondente.

**Rationale:** o card era placeholder sem navegação funcional. Manter código morto adiciona ruído.

## Risks / Trade-offs

- **Perda de histórico semanal** → Aceitável no MVP; não há usuários reais com dados. Documentar na migration.
- **Gráfico com muitos pontos** → Limitar a exibição às últimas 30 entradas no `EvolutionChart` para não sobrecarregar a tela.
- **Fuso horário** → `new Date().toISOString()` usa UTC. Usuários no Brasil (UTC-3) podem ver a virada do dia às 21h. Mitigação: usar `toLocaleDateString('en-CA')` (formato `YYYY-MM-DD`) para obter a data local.

## Migration Plan

1. Atualizar `supabase/migrations/0001_initial_schema.sql`: substituir bloco `weekly_checkins` por `daily_checkins`
2. Atualizar `useProgressStore.ts`: trocar campos e métodos
3. Atualizar testes do store
4. Atualizar `src/app/(tabs)/progress.tsx`: lógica de disable do botão
5. Remover card de check-in de `src/app/(tabs)/home.tsx` (ou arquivo equivalente)
6. Atualizar specs dos três capabilities afetados

**Rollback:** reverter `0001_initial_schema.sql` para versão com `weekly_checkins`. Como não há dados reais, não há rollback de dados necessário.

## Open Questions

- O gráfico na tela Progress deve exibir os últimos N dias ou as últimas N entradas com check-in? → Assumir **últimas 30 entradas com check-in** (dias sem check-in não geram ponto).
