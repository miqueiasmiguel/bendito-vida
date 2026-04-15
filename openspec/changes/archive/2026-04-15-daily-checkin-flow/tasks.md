## 1. Banco de Dados

- [x] 1.1 Remover bloco `weekly_checkins` de `supabase/migrations/0001_initial_schema.sql`
- [x] 1.2 Adicionar bloco `daily_checkins` (colunas: id, user_id, date date, energy_score, sleep_score, focus_score, created_at) com `UNIQUE(user_id, date)`, checks de range e RLS (SELECT + INSERT)

## 2. Store Zustand

- [x] 2.1 Atualizar interface `Checkin` em `useProgressStore.ts`: trocar campo `week: string` por `date: string` (YYYY-MM-DD)
- [x] 2.2 Substituir método `getCurrentWeekCheckin()` por `getTodayCheckin()` retornando o checkin cuja `date` é igual a `new Date().toLocaleDateString('en-CA')`
- [x] 2.3 Atualizar `addCheckin` para gravar `date` (data local) em vez de `week`

## 3. Testes do Store

- [x] 3.1 Atualizar `src/stores/__tests__/useProgressStore.test.ts`: substituir todas as referências a `week`/`getCurrentWeekCheckin` por `date`/`getTodayCheckin`
- [x] 3.2 Adicionar cenário de teste: `getTodayCheckin` retorna `undefined` quando não há checkin do dia
- [x] 3.3 Confirmar que `npm test -- useProgressStore` passa sem erros

## 4. Tela de Progresso

- [x] 4.1 Em `src/app/(tabs)/progress.tsx`, chamar `getTodayCheckin()` para determinar se o check-in do dia já foi feito
- [x] 4.2 Desabilitar o botão "Registrar" quando `getTodayCheckin()` retornar valor definido ou quando alguma escala não estiver preenchida
- [x] 4.3 Exibir texto "Check-in de hoje realizado ✓" e modo read-only quando check-in já existe

## 5. Gráfico de Evolução

- [x] 5.1 Atualizar `src/components/dashboard/EvolutionChart.tsx`: eixo X exibe label de data abreviado (`DD/MM`) em vez de semana (`SN`)
- [x] 5.2 Limitar exibição às 30 entradas mais recentes (em vez de 8)
- [x] 5.3 Atualizar `src/components/dashboard/__tests__/EvolutionChart.test.tsx` para refletir o novo formato de label

## 6. Tela Home

- [x] 6.1 Remover o card "Check-in da semana" de `src/app/(tabs)/home.tsx` (ou arquivo equivalente)
- [x] 6.2 Remover imports/componentes não utilizados relacionados ao card removido

## 7. Specs

- [x] 7.1 Sobrescrever `openspec/specs/progress-dashboard/spec.md` com o conteúdo do delta (check-in diário, `getTodayCheckin`, gráfico 30 pontos)
- [x] 7.2 Sobrescrever `openspec/specs/home-screen/spec.md` removendo o requirement do card de check-in semanal
- [x] 7.3 Sobrescrever `openspec/specs/database-schema/spec.md` substituindo o requirement de `weekly_checkins` pelo de `daily_checkins`
