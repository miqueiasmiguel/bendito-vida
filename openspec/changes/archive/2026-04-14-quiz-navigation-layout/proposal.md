## Why

O layout de navegação do quiz atual apresenta o botão "Próximo" isolado e a barra de progresso sem alinhamento centralizado, dificultando a usabilidade para o público-alvo (idosos e pessoas com baixa literacia digital). Adicionar o botão "Voltar" ao lado do "Próximo" e centralizar a barra de progresso melhora a orientação espacial do usuário durante o onboarding.

## What Changes

- O botão "Voltar" passa a ser exibido ao lado do botão "Próximo" (layout em linha, lado a lado)
- Na pergunta 1, o botão "Voltar" é ocultado (não há pergunta anterior)
- A barra de progresso é centralizada horizontalmente na tela
- O comportamento existente de navegação entre perguntas é mantido

## Capabilities

### New Capabilities
<!-- nenhuma capacidade nova -->

### Modified Capabilities
- `quiz-onboarding`: Requisitos de layout da barra de progresso (centralizada) e botões de navegação (Voltar ao lado do Próximo) estão mudando.

## Impact

- `src/app/(onboarding)/quiz.tsx` — ajuste de layout dos botões e da barra de progresso
- `src/components/quiz/` — possível ajuste em componentes de barra de progresso ou navegação
- Spec `openspec/specs/quiz-onboarding/spec.md` — atualização dos requisitos de layout
