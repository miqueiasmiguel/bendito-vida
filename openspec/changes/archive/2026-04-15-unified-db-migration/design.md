## Context

O Supabase é o backend de dados do Bendito Vida. Atualmente, apenas uma migration parcial existe (`20260415_add_onboarding_completed.sql`), criando a tabela `profiles` com apenas 4 colunas. As tabelas `mixes` (mixes salvos pelo usuário) e `weekly_checkins` (check-ins semanais do Dashboard de Evolução) não existem, bloqueando a implementação dos stores `useProfileStore` e `useProgressStore`.

A abordagem é substituir a migration parcial por um único arquivo `0001_initial_schema.sql` que representa o estado inicial completo do banco de dados — seguindo a convenção de "migration inicial monolítica" antes do sistema entrar em produção.

## Goals / Non-Goals

**Goals:**
- Unificar todas as DDLs em uma migration inicial (`0001_initial_schema.sql`)
- Definir schema completo: `profiles`, `mixes`, `weekly_checkins`
- Configurar RLS policies para isolamento por usuário em todas as tabelas
- Adicionar índices de performance nas FK e colunas de query frequente
- Garantir zero impacto no código existente (colunas e tabelas já referenciadas são mantidas)

**Non-Goals:**
- Criar stored procedures ou views (não há demanda no MVP)
- Configurar Supabase Storage buckets via migration (feito via Dashboard)
- Criar tabela de ingredientes no banco (ingredientes ficam em `src/data/ingredients.ts` — cálculo é local)
- Criar seed data no SQL (fixture de quiz questions fica em código)

## Decisions

### 1. Migration única vs. migrations incrementais

**Decisão:** Uma única migration inicial `0001_initial_schema.sql`.

**Rationale:** O projeto ainda não foi ao ar. Nenhuma instância de produção existe. Migration única para o estado inicial é a abordagem canônica antes do primeiro deploy — elimina o risco de estado intermediário inválido entre migrations, simplifica o `supabase db reset` em dev e facilita auditoria do schema.

**Alternativa descartada:** Manter a migration existente e criar `0002_add_mixes.sql` + `0003_add_weekly_checkins.sql`. Rejeitada porque criar granularidade de migration antes de qualquer deploy gera histórico de migrations sem valor — cada migration deve representar uma mudança sobre estado de produção.

### 2. Nomeação: `0001_initial_schema.sql` vs. timestamp

**Decisão:** Prefixo sequencial (`0001_`) ao invés de timestamp.

**Rationale:** A migration existente já usa timestamp (`20260415_`). Ao substituí-la por uma migration "fundacional", a convenção sequencial sinaliza explicitamente que é o estado inicial do schema — mais legível que um timestamp arbitrário. Demais migrations futuras usarão timestamps.

### 3. Campos `bioactive_profile` e `name` em `profiles` (JSONB vs. tabela separada)

**Decisão:** `bioactive_profile jsonb` e `name text` diretamente em `profiles`.

**Rationale:** O perfil bioativo é um objeto de leitura calculado localmente e salvo uma vez (pós-quiz). Não há queries por campos internos do JSONB no MVP. Tabela separada seria over-engineering. `jsonb` permite evolução futura sem migrations.

### 4. `ingredients` em `mixes` como `text[]` vs. JSONB

**Decisão:** `ingredients text[]` (array de IDs de ingredientes) + `nutrition jsonb` (sumário nutricional).

**Rationale:** Os IDs de ingredientes são strings simples. Armazenar apenas os IDs mantém a referência ao catálogo local (`src/data/ingredients.ts`). O sumário nutricional (`{ calories, fiber, protein, omega3 }`) é um objeto fixo — JSONB é ideal.

### 5. `week` em `weekly_checkins` como `text` no formato `YYYY-WNN`

**Decisão:** Coluna `week text NOT NULL` com constraint de unicidade por `(user_id, week)`.

**Rationale:** A spec do `useProgressStore` define o formato `"2026-W15"` explicitamente. Armazenar como texto evita conversões de timezone e coincide com a lógica ISO week do client (JavaScript `Intl`). A constraint unique garante 1 check-in por semana por usuário a nível de banco.

## Risks / Trade-offs

- **[Reset obrigatório]** → A migration existente deve ser deletada e o Supabase re-aplicado (`supabase db reset` em local ou re-run no SQL Editor do Dashboard). Qualquer dado já inserido em `profiles` será perdido. Mitigação: o projeto está em dev, não há dados de produção.

- **[JSONB sem schema enforcement]** → `bioactive_profile` e `nutrition` são JSONB sem validação de estrutura no banco. Mitigação: a validação ocorre no TypeScript via tipos exportados dos stores; erros de estrutura são capturados em dev.

- **[ISO week boundary]** → A lógica de semana ISO (segunda-domingo) é calculada no client JS. Se o client tiver timezone errado, semanas podem não bater. Mitigação: o app é mobile com timezone do dispositivo; para o MVP esse edge case é aceitável.

## Migration Plan

1. Deletar `supabase/migrations/20260415_add_onboarding_completed.sql`
2. Criar `supabase/migrations/0001_initial_schema.sql` com o schema completo
3. Aplicar via **Supabase Dashboard → SQL Editor** (projeto remoto) ou `supabase db reset` (local com Supabase CLI)
4. Verificar no Table Editor do Dashboard que as 3 tabelas foram criadas com RLS ativo

**Rollback:** Como não há dados de produção, o rollback é simplesmente restaurar a migration original ou aplicar `DROP TABLE` manualmente.
