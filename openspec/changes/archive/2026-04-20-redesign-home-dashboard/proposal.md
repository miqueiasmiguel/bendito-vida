## Why

A tela Home duplica o `WeeklyCheckinCard` (já existente em Evolução) e o lógica de busca do check-in do dia, criando fricção desnecessária — o usuário precisa navegar para outra aba para completar a ação. Além disso, o Simulador de Mix, core feature do produto, não tem destaque na Home, perdendo oportunidade de engajamento.

## What Changes

- **Remover** `WeeklyCheckinCard` da Home — o check-in completo pertence exclusivamente à aba Evolução
- **Adicionar** `TodayStatusCard`: card compacto que exibe os 3 scores do check-in de hoje (energia, sono, foco) como indicadores visuais; se ainda não houver check-in, exibe CTA "Registrar meu dia" que navega para a aba Evolução
- **Adicionar** `SimulatorCtaCard`: card de destaque com visual premium (fundo verde escuro, gradiente suave) e botão primário "Montar meu Mix" que navega para a aba Simulador — reforça posicionamento de core feature
- **Manter** `BioactiveMap` e `DailyTip` sem alteração

## Capabilities

### New Capabilities

- `today-status-card`: Card de resumo do check-in diário na Home — exibe scores do dia ou CTA para registrar

- `simulator-cta-card`: Card de acesso rápido ao Simulador Meu Mix na Home

### Modified Capabilities

- `home-screen`: Layout e ordem das seções mudam; `WeeklyCheckinCard` removido, `TodayStatusCard` e `SimulatorCtaCard` adicionados

## Impact

- `src/app/(tabs)/home.tsx` — remover `WeeklyCheckinCard`, adicionar novos cards, reordenar seções
- `src/components/dashboard/TodayStatusCard.tsx` — novo componente
- `src/components/dashboard/SimulatorCtaCard.tsx` — novo componente
- `src/components/dashboard/index.ts` — exportar novos componentes
- Lógica duplicada de busca do check-in de hoje em `home.tsx` removida junto com o card
- Nenhuma mudança em stores, backend ou navegação — só UI e composição de componentes
