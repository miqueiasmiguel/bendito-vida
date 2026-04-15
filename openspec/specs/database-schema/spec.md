## Requirements

### Requirement: Migration inicial cria tabela `profiles` completa
A migration `0001_initial_schema.sql` SHALL criar a tabela `profiles` com as colunas: `id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`, `name text`, `onboarding_completed boolean NOT NULL DEFAULT false`, `bioactive_profile jsonb`, `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()`. A tabela SHALL ter RLS habilitado com policies de SELECT, INSERT e UPDATE restritas ao `auth.uid() = id`. Um trigger SHALL atualizar `updated_at` automaticamente em cada UPDATE.

#### Scenario: Tabela profiles criada com RLS
- **WHEN** a migration é aplicada
- **THEN** a tabela `profiles` existe com as 6 colunas definidas, RLS está ativo, e as 3 policies (select, insert, update) estão presentes

#### Scenario: Trigger updated_at funciona
- **WHEN** uma linha de `profiles` é atualizada via `UPDATE`
- **THEN** a coluna `updated_at` é automaticamente atualizada para `now()`

#### Scenario: Cascata ao deletar usuário
- **WHEN** um usuário é deletado de `auth.users`
- **THEN** o registro correspondente em `profiles` é deletado automaticamente (ON DELETE CASCADE)

---

### Requirement: Migration inicial cria tabela `mixes`
A migration SHALL criar a tabela `mixes` com as colunas: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`, `name text NOT NULL`, `ingredients text[] NOT NULL DEFAULT '{}'`, `nutrition jsonb NOT NULL DEFAULT '{}'`, `created_at timestamptz NOT NULL DEFAULT now()`. A tabela SHALL ter RLS habilitado com policies de SELECT, INSERT e DELETE restritas ao `auth.uid() = user_id`. Um índice SHALL existir em `(user_id, created_at DESC)` para otimizar a query do perfil.

#### Scenario: Tabela mixes criada com RLS
- **WHEN** a migration é aplicada
- **THEN** a tabela `mixes` existe com as 6 colunas, RLS está ativo e as 3 policies estão presentes

#### Scenario: Usuário só vê seus próprios mixes
- **WHEN** um SELECT é executado autenticado como usuário A
- **THEN** apenas os mixes com `user_id = A` são retornados

#### Scenario: Cascata ao deletar usuário
- **WHEN** um usuário é deletado de `auth.users`
- **THEN** todos os seus mixes são deletados automaticamente (ON DELETE CASCADE)

---

### Requirement: Migration inicial cria tabela `daily_checkins`
A migration SHALL criar a tabela `daily_checkins` com as colunas: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`, `date date NOT NULL` (formato `YYYY-MM-DD`), `energy_score smallint NOT NULL CHECK (energy_score BETWEEN 1 AND 5)`, `sleep_score smallint NOT NULL CHECK (sleep_score BETWEEN 1 AND 5)`, `focus_score smallint NOT NULL CHECK (focus_score BETWEEN 1 AND 5)`, `created_at timestamptz NOT NULL DEFAULT now()`. A constraint `UNIQUE(user_id, date)` SHALL garantir um único check-in por dia por usuário. A tabela SHALL ter RLS com policies de SELECT e INSERT restritas ao `auth.uid() = user_id`.

#### Scenario: Tabela daily_checkins criada com RLS
- **WHEN** a migration é aplicada
- **THEN** a tabela `daily_checkins` existe com as 7 colunas, constraint unique em `(user_id, date)`, checks de range nos scores, RLS ativo e as 2 policies presentes

#### Scenario: Constraint de unicidade por dia
- **WHEN** um INSERT tenta adicionar um segundo check-in com o mesmo `user_id` e `date`
- **THEN** o banco rejeita com erro de unique constraint violation

#### Scenario: Check de range dos scores
- **WHEN** um INSERT tenta gravar `energy_score = 0` ou `energy_score = 6`
- **THEN** o banco rejeita com erro de check constraint violation

#### Scenario: Cascata ao deletar usuário
- **WHEN** um usuário é deletado de `auth.users`
- **THEN** todos os seus check-ins são deletados automaticamente (ON DELETE CASCADE)

---

### Requirement: Migration anterior é substituída (não coexiste)
O arquivo `supabase/migrations/20260415_add_onboarding_completed.sql` SHALL ser removido do repositório. Apenas `0001_initial_schema.sql` SHALL existir em `supabase/migrations/`. Não devem coexistir duas migrations que criam a tabela `profiles`.

#### Scenario: Apenas uma migration no diretório
- **WHEN** o diretório `supabase/migrations/` é listado após a mudança
- **THEN** apenas o arquivo `0001_initial_schema.sql` está presente
