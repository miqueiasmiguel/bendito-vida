-- =============================================================
-- 0001_initial_schema.sql — Bendito Vida initial database schema
-- Apply via: Supabase Dashboard → SQL Editor, or `supabase db reset`
-- =============================================================

-- ------------------------------------------------------------------
-- Helper: auto-update updated_at on every UPDATE
-- ------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------
-- Table: profiles
-- ------------------------------------------------------------------

CREATE TABLE profiles (
  id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                text,
  onboarding_completed boolean    NOT NULL DEFAULT false,
  bioactive_profile   jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ------------------------------------------------------------------
-- Table: mixes
-- ------------------------------------------------------------------

CREATE TABLE mixes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  ingredients text[]      NOT NULL DEFAULT '{}',
  nutrition   jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX mixes_user_id_created_at_idx
  ON mixes (user_id, created_at DESC);

ALTER TABLE mixes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mixes"
  ON mixes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mixes"
  ON mixes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mixes"
  ON mixes FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Table: daily_checkins
-- NOTE: replaces weekly_checkins (MVP pre-launch, no historical data to migrate)
-- ------------------------------------------------------------------

CREATE TABLE daily_checkins (
  id           uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         date     NOT NULL,
  energy_score smallint NOT NULL CHECK (energy_score BETWEEN 1 AND 5),
  sleep_score  smallint NOT NULL CHECK (sleep_score BETWEEN 1 AND 5),
  focus_score  smallint NOT NULL CHECK (focus_score BETWEEN 1 AND 5),
  created_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT daily_checkins_user_date_unique UNIQUE (user_id, date)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own checkins"
  ON daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);
