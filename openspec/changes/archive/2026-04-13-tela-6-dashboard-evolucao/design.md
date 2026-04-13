## Context

O app já tem infra (Zustand, Supabase, Reanimated 4, tema) e as telas 1–5 implementadas. A Tela 6 é o Dashboard de Evolução (`/(tabs)/progress`), atualmente um placeholder. Precisa de: formulário de check-in, gráfico de linha semanal e insight textual. O Supabase tem a tabela `checkins` (schema em FEATURES.md). A New Architecture (Expo SDK 55) impõe restrições de compatibilidade sobre libs de gráfico.

## Goals / Non-Goals

**Goals:**
- Formulário de check-in semanal (3 escalas 1–5): Disposição, Sono, Foco
- Gráfico de linha mostrando histórico de score médio por semana (máx. 8 semanas)
- Insight textual derivado do histórico (comparação com semana anterior)
- Persistência local via Zustand + sync com Supabase `checkins`
- Um check-in por semana (bloqueado se já fez na semana corrente)

**Non-Goals:**
- Gráfico interativo com zoom/pan
- Exportação de dados
- Notificações de lembrete de check-in
- Análise por nutriente (cruzar check-in com mix do simulador)

## Decisions

### 1. Biblioteca de gráfico: `react-native-chart-kit` (com `react-native-svg`)
**Escolha**: `react-native-chart-kit@6` + `react-native-svg@15`.
**Alternativas consideradas**:
- `victory-native` v41 (Skia-based): excelente performance, mas requer `@shopify/react-native-skia` (~5 MB) e config nativa adicional desnecessária para um gráfico simples de linha.
- `react-native-gifted-charts`: boa API, mas pouco testada com New Architecture SDK 55.
**Razão**: `chart-kit` é a lib mais citada na comunidade Expo, `react-native-svg` já é peer dep comum e funciona com New Architecture. Suficiente para um gráfico de linha simples sem interatividade.

### 2. Persistência: Zustand local + Supabase async (não-bloqueante)
**Escolha**: Check-ins são salvos imediatamente no store Zustand (otimista) e sincronizados com Supabase em background. UI nunca bloqueia na rede.
**Razão**: Público com baixa conectividade (semiárido PB). A avaliação de demo ocorre em ambiente controlado, mas o app precisa funcionar sem rede.

### 3. Score do insight: média simples (Disposição + Sono + Foco) / 3
**Razão**: Cálculo local <1ms, sem dependência de ML. Comparação com semana anterior é suficiente para o "Insight" da spec.

### 4. Componentes novos em `src/components/dashboard/`
`WeeklyCheckinCard`, `EvolutionChart`, `InsightBanner` — pasta `dashboard/` já existe com outros componentes (`BioactiveMap`, `DailyTip`). Consistente com estrutura existente.

## Risks / Trade-offs

- **[Risk] `react-native-chart-kit` com New Architecture** → Mitigation: `react-native-svg` 15.x tem suporte explícito a New Architecture; chart-kit usa SVG via essa lib, logo herda compatibilidade. Testar no dev build antes de considerar concluído.
- **[Risk] Sem dados de check-in no primeiro acesso** → Mitigation: Estado vazio exibe mensagem de onboarding ("Faça seu primeiro check-in!") em vez de gráfico vazio.
- **[Trade-off] Zustand apenas (sem Supabase real-time)** → Aceitável para MVP; o avaliador verá dados mockados/locais na demo.
