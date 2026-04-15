## MODIFIED Requirements

### Requirement: Migration inicial cria tabela `daily_checkins`
A migration `0001_initial_schema.sql` SHALL criar a tabela `daily_checkins` (em substituição à `weekly_checkins`) com as colunas: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`, `date date NOT NULL` (data local no formato `YYYY-MM-DD`), `energy_score smallint NOT NULL CHECK (energy_score BETWEEN 1 AND 5)`, `sleep_score smallint NOT NULL CHECK (sleep_score BETWEEN 1 AND 5)`, `focus_score smallint NOT NULL CHECK (focus_score BETWEEN 1 AND 5)`, `created_at timestamptz NOT NULL DEFAULT now()`. A constraint `UNIQUE(user_id, date)` SHALL garantir um único check-in por dia por usuário. A tabela SHALL ter RLS com policies de SELECT e INSERT restritas ao `auth.uid() = user_id`. A tabela `weekly_checkins` NÃO SHALL existir na migration.

#### Scenario: Tabela daily_checkins criada com RLS
- **WHEN** a migration é aplicada
- **THEN** a tabela `daily_checkins` existe com as 7 colunas, constraint unique em `(user_id, date)`, checks de range nos scores, RLS ativo e as 2 policies (SELECT e INSERT) presentes

#### Scenario: Constraint de unicidade por dia
- **WHEN** um INSERT tenta adicionar um segundo check-in com o mesmo `user_id` e `date`
- **THEN** o banco rejeita com erro de unique constraint violation

#### Scenario: Check de range dos scores
- **WHEN** um INSERT tenta gravar `energy_score = 0` ou `energy_score = 6`
- **THEN** o banco rejeita com erro de check constraint violation

#### Scenario: Cascata ao deletar usuário
- **WHEN** um usuário é deletado de `auth.users`
- **THEN** todos os seus check-ins diários são deletados automaticamente (ON DELETE CASCADE)

## REMOVED Requirements

### Requirement: Migration inicial cria tabela `weekly_checkins`
**Reason:** Substituída por `daily_checkins` com granularidade diária.
**Migration:** Remover o bloco de criação de `weekly_checkins` de `0001_initial_schema.sql`. Não há dados reais para migrar (MVP pré-lançamento).
