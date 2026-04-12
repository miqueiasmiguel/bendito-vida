# CLAUDE.md — Bendito Vida (App Mobile)

## Contexto

**Bendito Vida** é um app mobile de educação nutricional + gamificação vinculado à **Bendito Grão Store** (Paraíba). MVP para edital do governo estadual de Segurança Alimentar e Nutricional. Priorize funcionalidade demonstrável e polish visual — o avaliador vai ver uma demo, não ler código.

**Docs complementares (ler sob demanda, NÃO carregar todos de uma vez):**
- `docs/FEATURES.md` — Specs de telas, dados de ingredientes, engine nutricional, banco Supabase. **Ler quando for implementar uma feature específica.**
- `docs/INFRASTRUCTURE.md` — Setup de ESLint, Prettier, Jest, Husky, GitHub Actions, EAS. **Ler apenas no primeiro prompt (setup de infra).**

---

## Stack

| Camada      | Tecnologia                                  |
| ----------- | ------------------------------------------- |
| Framework   | React Native 0.83 + **Expo SDK 55**         |
| React       | React 19.2                                  |
| Arquitetura | **New Architecture (única opção SDK 55)**    |
| Navegação   | **Expo Router** (file-based, Native Tabs)    |
| Estado      | **Zustand**                                  |
| Backend     | **Supabase** (auth, db, storage)             |
| Linguagem   | **TypeScript** (strict)                      |
| Animações   | **React Native Reanimated 4**                |
| Gestos      | React Native Gesture Handler                 |
| Ícones      | Lucide React Native (stroke 1.5-2px)         |
| Fonte       | Poppins (SemiBold headings, Regular body)    |

### SDK 55 — Breaking Changes

1. `newArchEnabled` removido do `app.json`. New Architecture only. Não adicionar esse campo.
2. Rotas em `/src/app`, não `/app`. Configs (`app.json`, `tsconfig.json`) ficam na raiz.
3. Nomes de rota em **kebab-case** (`quiz-result.tsx`, não `quizResult.tsx`).
4. **Native Tabs API** — `<Tabs />` do expo-router renderiza tabs nativas.
5. `expo-av` **removido**. Usar `expo-video` / `expo-audio`.
6. `expo-file-system` — import padrão agora é a nova API. Legacy: `expo-file-system/legacy`.
7. **Expo Go não está nas stores para SDK 55.** Usar dev build (`expo-dev-client`).
8. **Reanimated v4** obrigatório. v3 incompatível.
9. `@shopify/flash-list` v2+ para listas grandes.
10. `tsconfig.json` alias: `@/*` → `./src/*`.

---

## Design System

### Cores
```
primary-700: #2D6A2E  (verde principal)     primary-100: #E8F0E4
primary-500: #3D8B3E  (verde intermediário)
accent-500:  #E87A1E  (laranja — CTAs APENAS, usar com moderação)
accent-100:  #FFF0E0
neutral-900: #1A1A1A  (texto)    neutral-700: #4A4A4A  (texto secundário)
neutral-400: #9E9E9E  (placeholder)  neutral-200: #E0E0E0  (bordas)
neutral-50:  #FAF7F2  (background — creme, nunca branco puro)
success: #4CAF50  error: #E53935  warning: #FFA726  info: #42A5F5
```

### Tipografia (Poppins)
H1=28/36 SemiBold · H2=22/30 SemiBold · H3=18/24 SemiBold · Body=15/22 Regular · Caption=13 · Small=11 (mínimo)

### Raios e Espaçamento
Cards: 16px · Botões: 24px · Inputs: 12px · Badge: 8px
Spacing: xs=4 sm=8 md=16 lg=24 xl=32 xxl=48

### Componentes Visuais
- **Botão primário:** bg `accent-500`, texto branco, radius 24. Somente ação principal da tela.
- **Botão secundário:** border `primary-700` 1.5px, texto `primary-700`, bg transparente, radius 24.
- **Cards:** bg white, radius 16, padding 16, shadow offset(0,2) opacity 0.08 radius 8, elevation 2.
- **Inputs:** radius 12, border `neutral-200` 1px, padding 14, font 15. Focus: border `primary-700`.

### Identidade
Orgânico, acolhedor, premium. Background creme (#FAF7F2). Formas arredondadas. Ícones stroke 1.5-2px. Microinterações 300ms ease-out. Feedback tátil (expo-haptics) no simulador.

---

## Estrutura de Pastas

```
bendito-vida/
├── src/
│   ├── app/                    # Expo Router
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Welcome
│   │   ├── (auth)/             # login, register
│   │   ├── (onboarding)/       # quiz
│   │   ├── (tabs)/             # home, simulator, progress, profile
│   │   └── result.tsx          # Cartão de Receita
│   ├── components/
│   │   ├── ui/                 # Button, Card, Input, Badge, ProgressBar
│   │   ├── quiz/
│   │   ├── simulator/          # Jar, IngredientCard, NutrientBar, NudgeAlert
│   │   ├── dashboard/
│   │   └── shared/             # Header, Logo, ParaibaHighlight
│   ├── theme/                  # colors, typography, spacing, index
│   ├── stores/                 # useAuthStore, useQuizStore, useSimulatorStore, useProgressStore
│   ├── data/                   # ingredients, quiz-questions, nutrition-engine
│   ├── lib/                    # supabase, haptics
│   ├── types/
│   └── utils/                  # match-profile, formatters
├── docs/                       # FEATURES.md, INFRASTRUCTURE.md
├── assets/                     # fonts/, images/, icons/
├── .github/workflows/          # ci.yml, eas-preview.yml
├── app.json                    # Config na raiz
├── eas.json
├── tsconfig.json
└── package.json
```

### Rotas
```
/                       → Welcome
/(auth)/login           → Login
/(auth)/register        → Cadastro
/(onboarding)/quiz      → Quiz de triagem
/(tabs)/home            → Home + Mapa Bioativo
/(tabs)/simulator       → Simulador "Meu Mix"
/(tabs)/progress        → Dashboard de Evolução
/(tabs)/profile         → Perfil
/result                 → Cartão de Receita
```

---

## Prioridades (ordem de implementação)

1. **🔒 Infraestrutura** — Ler `docs/INFRASTRUCTURE.md` e executar. Nenhuma feature antes disso.
2. **Tema + componentes UI base** (Button, Card, Input, Badge, ProgressBar)
3. **Welcome + Auth** (Supabase email/senha)
4. **Quiz de Triagem** → ler spec em `docs/FEATURES.md`
5. **Home (Mapa Bioativo)** → ler spec em `docs/FEATURES.md`
6. **Simulador "Meu Mix"** → CORE FEATURE, investir aqui. Ler spec em `docs/FEATURES.md`
7. **Cartão de Receita**
8. **Dashboard de Evolução**
9. **Perfil**

---

## Protocolo de Criação de Componentes (OBRIGATÓRIO)

Antes de criar QUALQUER componente:

1. **Verificar se já existe** em `src/components/`. Se funcionalidade similar existe, reutilizar/estender via props. Verificar também se lib instalada (Lucide, @expo/ui) resolve. **Nunca duplicar.**
2. **Pesquisar padrões** — Como é feito no ecossistema RN? Acessibilidade exigida (roles, labels)? Precisa de animação (→ Reanimated 4)?
3. **Implementar** — Pasta correta (`ui/` genéricos, `[domínio]/` específicos). Props tipadas com interface exportada. Tokens do tema, zero hardcode. `accessibilityLabel`/`accessibilityRole`. Touch area mínima 44x44. **1 teste unitário mínimo.**
4. **Registrar** — Componentes UI genéricos: exportar em `src/components/ui/index.ts`.

---

## Padrões de Código

- Componentes funcionais + hooks. Nunca class components.
- Props: `interface`, não `type`.
- PascalCase para componentes, kebab-case para utilitários/rotas.
- Zustand: `useXxxStore.ts`.
- `any` proibido → usar `unknown` + type guards.
- Estilos: `StyleSheet.create()`. Nunca inline objects.
- Cores/tipografia: sempre tokens (`colors.primary[700]`). Nunca hex direto.
- Imports: alias `@/` (ex: `import { colors } from '@/theme'`).
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, etc.).

### Performance
- Cálculo nutricional LOCAL (array reduce), sem API, <200ms.
- Listas: `FlatList` + `keyExtractor`. `@shopify/flash-list` se crescer.
- Imagens: `expo-image`, não `Image` do RN.
- Animações: Reanimated 4 (UI thread). Nunca `Animated` do RN.

### Acessibilidade
- Público: idosos + baixa literacia digital.
- Touch area ≥ 44x44.
- Contraste: branco sobre `primary-700`, `neutral-900` sobre `neutral-50`.
- Labels em todos inputs/botões.
- Fonte mínima: 13px.

---

## O Que NÃO Fazer

- **NÃO** começar features antes da infra (`docs/INFRASTRUCTURE.md`) estar configurada e commitada.
- **NÃO** criar componente sem seguir o Protocolo de Criação (acima).
- **NÃO** fazer commit sem lint-staged / push sem CI verde.
- **NÃO** adicionar `newArchEnabled` ao `app.json`.
- **NÃO** usar `expo-av`, Reanimated v3, `Image` do RN, cores hardcoded, inline styles, `any`.
- **NÃO** colocar rotas em `/app` raiz. Usar `/src/app`.
- **NÃO** contar com Expo Go das stores. Usar dev build.
- **NÃO** implementar drag & drop. Usar toque para adicionar/remover.
- **NÃO** inventar dados nutricionais. Marcar como placeholder.
- **NÃO** overengineer auth (email/senha basta) nem criar backend custom (Supabase basta).
- **NÃO** escrever componente UI sem teste.

---

## Variáveis de Ambiente

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Acessar via `process.env.EXPO_PUBLIC_SUPABASE_URL`.

---

## Checklist de Entrega (MVP)

**Infra:** ESLint + Prettier + Jest + Husky + GitHub Actions + eas.json ✅ `npm run validate` passando

**Features:** Welcome → Quiz → Home → Simulador → Receita (fluxo completo) · Design verde/laranja/creme · Poppins · Ingredientes paraibanos destacados · Cálculo nutricional real-time · Nudges · Cartão compartilhável · Check-in semanal · Gráfico evolução · Auth Supabase · Responsivo 5"-6.7"

**Qualidade:** Zero warnings deprecated · `expo-doctor` limpo · Cobertura ≥ 60% · CI verde · Nenhum `any`