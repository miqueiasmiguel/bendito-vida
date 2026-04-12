## Why

O fluxo de onboarding do Bendito Vida começa na tela Welcome, mas não existe ainda a Tela 2 — o Quiz de Triagem Nutricional — que coleta objetivos e restrições do usuário para gerar seu perfil nutricional personalizado ("Mapa Bioativo"). Sem ela, o app não tem como personalizar recomendações de ingredientes e o fluxo completo do MVP fica bloqueado.

## What Changes

- Nova rota `/(onboarding)/quiz` com 5 perguntas sequenciais (transição horizontal)
- Barra de progresso animada no topo (ex: "3 de 5")
- Cards de seleção de resposta com estado ativo (borda `primary-700`)
- Botão "Próximo" que aparece apenas após seleção (CTA accent-500)
- Pergunta 4 com multi-seleção (restrições alimentares)
- Algoritmo de mapeamento resposta → tags de nutrientes (local, sem API)
- Resultado final: perfil com 3 nutrientes prioritários + ingredientes sugeridos
- Persistência do perfil via Zustand (`useQuizStore`)
- Navegação para `/(tabs)/home` ao concluir

## Capabilities

### New Capabilities
- `quiz-onboarding`: Fluxo de quiz de triagem nutricional com 5 perguntas, seleção única/múltipla, progresso visual e algoritmo de perfil nutricional.

### Modified Capabilities
- `app-navigation`: Adicionar rota `/(onboarding)/quiz` ao layout de navegação e a transição Welcome → Quiz → Home.

## Impact

- **Arquivos novos:** `src/app/(onboarding)/quiz.tsx`, `src/app/(onboarding)/_layout.tsx`, `src/data/quiz-questions.ts`, `src/stores/useQuizStore.ts`, `src/utils/match-profile.ts`, `src/components/quiz/QuizCard.tsx`, `src/components/quiz/ProgressBar.tsx` (ou reutilizar do `ui/`)
- **Arquivos modificados:** `src/app/index.tsx` (botão "Começar" navega para `/quiz`), `src/components/ui/index.ts` (exportar novos componentes genéricos se criados)
- **Dependências:** Reanimated 4 (transições), Zustand (estado do quiz), sem backend (cálculo local)
- **Testes:** Mínimo 1 teste unitário por componente novo + testes do algoritmo de perfil
