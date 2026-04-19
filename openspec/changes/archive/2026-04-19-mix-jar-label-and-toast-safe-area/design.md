## Context

O `MixJar` renderiza um SVG com um `AnimatedSvgText` "Seu Mix Exclusivo" que faz fade-out quando o nível de preenchimento ultrapassa 60%. Com a adição de partículas e camadas coloridas, o rótulo passou a competir visualmente com o conteúdo do pote. A decisão de removê-lo simplifica o componente e elimina estado desnecessário.

O `NudgeAlert` é renderizado como `position: 'absolute'` dentro do `SafeAreaView` da tela do simulador, mas usa `top: spacing.lg` (24px) fixo. Em dispositivos com status bar alta (notch, Dynamic Island), o `SafeAreaView` com `edges={['top']}` já consome o inset superior — o toast aparece corretamente. Porém, o `NudgeAlert` é posicionado **dentro do conteúdo scrollável/relativo**, não no nível do `SafeAreaView`, portanto o offset de 24px não é suficiente em todos os contextos.

## Goals / Non-Goals

**Goals:**
- Remover o rótulo SVG e toda a lógica de animação associada do `MixJar`
- Garantir que o toast de nudge nunca sobreponha a status bar, independente do dispositivo
- Manter compatibilidade com Reanimated 4 e React Native Safe Area Context já instalados

**Non-Goals:**
- Redesenhar o visual do pote além da remoção do rótulo
- Alterar comportamento ou timing das animações do nudge
- Suportar múltiplos toasts simultâneos

## Decisions

### 1. Remoção total do rótulo vs. torná-lo opcional via prop

**Decisão:** Remoção total.

**Rationale:** A prop introduziria complexidade sem uso concreto. O rótulo não aparece em nenhuma spec de design aprovada e o componente já tem `accessibilityLabel` no `View` container. Nenhum consumidor atual usa a funcionalidade de rótulo de forma significativa.

**Alternativa descartada:** `showLabel?: boolean` — adiciona API sem valor imediato.

### 2. Safe area no NudgeAlert: `useSafeAreaInsets` no próprio componente vs. receber inset como prop

**Decisão:** `useSafeAreaInsets` diretamente no `NudgeAlert`.

**Rationale:** O componente é sempre renderizado dentro de um `SafeAreaProvider` (já configurado no `_layout.tsx`). Usar o hook internamente mantém o componente autossuficiente — o chamador não precisa passar `insets`. A prop seria mais testável mas introduz acoplamento desnecessário na call site.

**Como aplicar:** `top: insets.top + spacing.sm` — usa o inset real da safe area mais um pequeno padding visual (8px) acima do toast.

## Risks / Trade-offs

- [Remoção do label quebra snapshots de teste existentes] → Atualizar asserções no `MixJar.test.ts` que verificam a presença do texto "Seu Mix Exclusivo"
- [useSafeAreaInsets fora do Provider] → Risco nulo: o provider já existe no root layout; se não existir, o hook retorna `{top: 0, ...}` silenciosamente
