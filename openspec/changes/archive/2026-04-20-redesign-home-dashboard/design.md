## Context

A Home atual tem 3 seções: `BioactiveMap`, `WeeklyCheckinCard` (compact) e `DailyTip`. O `WeeklyCheckinCard` na Home é read-only/compact e redireciona para a aba Evolução — não agrega valor além de um link. A lógica de busca do check-in do dia está duplicada em `home.tsx` e `progress.tsx`. O Simulador é a core feature do produto mas não tem presença visual na Home.

Nenhuma mudança é necessária em stores (Zustand), backend (Supabase) ou sistema de navegação (Expo Router) — tudo é puramente composição de componentes de UI.

## Goals / Non-Goals

**Goals:**
- Remover duplicação de lógica e UI entre Home e Evolução
- Dar ao Simulador destaque proporcional ao seu papel de core feature
- Mostrar o status do dia de forma compacta e legível, sem exigir ação do usuário na Home
- Manter todos os componentes existentes — sem quebrar Evolução, Simulador ou BioactiveMap

**Non-Goals:**
- Permitir submeter check-in diretamente pela Home (pertence à aba Evolução)
- Alterar lógica de cálculo nutricional ou quiz
- Redesign do BioactiveMap ou DailyTip
- Adicionar animações complexas além de microinterações (300ms ease-out)

## Decisions

### 1. `TodayStatusCard` como componente separado, não extensão do `WeeklyCheckinCard`

**Escolha:** novo componente `TodayStatusCard` independente.

**Alternativa descartada:** adicionar prop `ultraCompact` ao `WeeklyCheckinCard` existente.

**Rationale:** `WeeklyCheckinCard` já tem dois modos (`compact` e completo) e cresceria complexidade de prop-drilling. `TodayStatusCard` tem responsabilidade única: exibir snapshot de hoje ou CTA. Mais fácil de testar isoladamente.

### 2. `TodayStatusCard` navega para Evolução, não abre bottom sheet

**Escolha:** toque no card ou no botão CTA navega para `/(tabs)/progress`.

**Alternativa descartada:** bottom sheet inline na Home para registrar check-in.

**Rationale:** bottom sheet replicaria o formulário do `WeeklyCheckinCard`, criando mais duplicação. Redirecionar mantém o formulário em um único lugar (aba Evolução), consistente com o padrão de single source of truth do Zustand.

### 3. `SimulatorCtaCard` como card visual rico, não botão simples

**Escolha:** card com fundo `primary-700`, ícone de frasco, headline e botão primário accent.

**Alternativa descartada:** botão secundário flutuante no header da Home.

**Rationale:** o Simulador precisa de peso visual na Home para comunicar que é a feature principal do produto. Um card ocupa espaço adequado e permite copy explicativo sobre o que é o Meu Mix.

### 4. Ordem das seções na Home

Nova ordem: Saudação → `SimulatorCtaCard` → `BioactiveMap` → `TodayStatusCard` → `DailyTip`

**Rationale:** SimulatorCtaCard logo após a saudação captura atenção na dobra — usuários recorrentes vão direto para o Mix. BioactiveMap antes do status de check-in reforça que o perfil nutricional é o contexto do app.

### 5. Dados do `TodayStatusCard` via `useProgressStore` direto, sem prop drilling

**Escolha:** o componente recebe `checkin?: CheckinEntry` via prop (extraída pelo pai `home.tsx`).

**Rationale:** consistente com o padrão atual do app — o screen extrai do store e passa como props para componentes de UI. Facilita testes unitários dos componentes.

## Risks / Trade-offs

- **Usuário não encontra o check-in imediatamente** → O `TodayStatusCard` serve como atalho visível com CTA claro; o fluxo principal em Evolução permanece intacto.
- **`SimulatorCtaCard` aumenta comprimento da Home** → Aceitável; ScrollView já está implementado. Cards têm padding correto do design system.
- **Dois novos arquivos de componente** → Custo baixo; cada um tem responsabilidade única e ~80 linhas estimadas.
