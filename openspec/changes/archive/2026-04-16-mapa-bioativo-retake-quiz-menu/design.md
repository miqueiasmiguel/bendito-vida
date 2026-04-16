## Context

O `BioactiveMap` é um componente de card que atualmente tem um título fixo ("Mapa Bioativo") no topo esquerdo. Não há nenhuma ação secundária disponível após o preenchimento do perfil, exceto o botão "Fazer Quiz →" que só aparece no estado vazio. A mudança é puramente de UI/UX dentro de um único componente — não envolve novas rotas, stores, nem dados.

## Goals / Non-Goals

**Goals:**
- Adicionar um botão de menu (três pontinhos) no canto superior direito do card, visível em ambos os estados
- Ao tocar, exibir um `Modal` leve com a opção "Refazer quiz" (e botão de cancelar)
- Navegar para `/(onboarding)/quiz` ao confirmar

**Non-Goals:**
- Implementar ActionSheet nativo (expo-action-sheet) — evitar dependência extra para uma ação simples
- Adicionar outras opções ao menu no momento (ex: "Compartilhar", "Limpar perfil")
- Animação complexa de abertura do menu

## Decisions

### 1. Modal interno vs. biblioteca de ActionSheet

**Decisão:** `Modal` do React Native + estilização manual como bottom-sheet mínimo.

**Alternativas consideradas:**
- `@expo/action-sheet` / `expo-action-sheet`: requer instalação de pacote extra para apenas uma ação
- `react-native-modal`: overengineering para o caso de uso
- Alert nativo (`Alert.alert`): funciona mas é inconsistente visualmente com o design system

**Rationale:** Um `Modal` com overlay semitransparente + card inferior é simples (~30 linhas), não adiciona dependências, e pode ser customizado com as cores/tipografia do design system.

### 2. Posicionamento do botão no header do card

**Decisão:** Row com `justifyContent: 'space-between'` no header do card, contendo título à esquerda e `TouchableOpacity` com `MoreVertical` (Lucide) à direita.

**Rationale:** O título "Mapa Bioativo" já usa estilo próprio — basta envolvê-lo em uma View row com o ícone. Sem reestruturação do layout.

### 3. Visibilidade nos dois estados (preenchido e vazio)

**Decisão:** O botão de menu aparece em ambos os estados. No estado vazio, "Refazer quiz" faz o mesmo que "Fazer Quiz →" mas via menu, tornando o botão inline opcional no futuro.

**Rationale:** Consistência visual — o card sempre tem o mesmo header independente do estado.

## Risks / Trade-offs

- [Modal ocupa tela inteira] → Mitigação: usar `transparent` background no Modal e posicionar o card de opções na parte inferior com overlay escuro semitransparente
- [Touch area do ícone pequena] → Mitigação: `padding: spacing.sm` no TouchableOpacity garante área ≥ 44×44
