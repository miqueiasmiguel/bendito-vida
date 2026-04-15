## Context

O app tem dois pontos onde o comportamento e a aparência divergem do esperado:

1. **Reactivity gap no store de progresso** — `progress.tsx` subscreve `getTodayCheckin` (a função) em vez de `checkins` (o dado). Como Zustand compara por referência, a função nunca muda, então o componente não re-renderiza quando `addCheckin` atualiza o array. Resultado: `existingCheckin` permanece `undefined` após o submit.

2. **Inconsistência visual do selo paraibano** — `IngredientCard` (Meu Mix) usa `<Leaf />` do Lucide em círculo verde posicionado absolutamente. `BioactiveMap` usa um `<Text>` com fundo verde. A identidade visual do app usa o ícone de folha como marca dos ingredientes paraibanos; o texto é uma regressão.

## Goals / Non-Goals

**Goals:**
- Card e botão de check-in desabilitam imediatamente após submit, sem reload
- Modo compact do `WeeklyCheckinCard` na home recebe `existingCheckin` e exibe estado "já feito"
- Selo paraibano no `BioactiveMap` usa o mesmo padrão visual do `IngredientCard`

**Non-Goals:**
- Refatorar o store de progresso além da correção do selector
- Animar a transição do card ao desabilitar
- Unificar o selo em um componente compartilhado (pode ser feito, mas não é necessário agora)

## Decisions

### D1 — Selector Zustand: assinar `checkins`, não `getTodayCheckin`

**Opção A (escolhida):** `useProgressStore((s) => s.checkins)` + derivar localmente com `.find()`.

```tsx
const checkins = useProgressStore((s) => s.checkins);
const today = new Date().toLocaleDateString('en-CA');
const currentCheckin = checkins.find((c) => c.date === today);
```

**Opção B:** `useProgressStore((s) => s.getTodayCheckin())` — chamar a função dentro do selector.

Opção A é preferida porque:
- É explícita sobre o que está sendo subscrito
- Não esconde side effects dentro do selector
- Consistente com o padrão já usado em `checkins` no mesmo arquivo

### D2 — Modo compact do `WeeklyCheckinCard` na home

A home (`home.tsx`) não renderiza o `WeeklyCheckinCard` atualmente. Quando for adicionado, deve receber:

```tsx
<WeeklyCheckinCard
  compact
  existingCheckin={existingCheckin}  // ou undefined se não houver
  onPress={() => router.push('/(tabs)/progress')}
/>
```

O componente já suporta a prop `existingCheckin` no modo compact — mas não faz nada com ela. A mudança é: quando `existingCheckin` estiver presente em modo compact, o botão "Responder" deve ser substituído por um label "Feito hoje ✓" (não clicável, ou navegando para progress para ver os valores).

### D3 — Selo paraibano no `BioactiveMap`

Replicar o padrão do `IngredientCard` diretamente no chip do `BioactiveMap`. Não extrair para componente compartilhado agora (YAGNI — apenas dois usos, layouts diferentes).

```tsx
{ingredient.isParaibano && (
  <View style={styles.leafSeal} accessibilityLabel="Ingrediente paraibano">
    <Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />
  </View>
)}
```

O chip (`ingredientChip`) passa a ter `overflow: 'visible'` e `position: 'relative'` para o selo absoluto aparecer no canto superior direito, igual ao `IngredientCard`.

## Risks / Trade-offs

- **Chip layout quebrado:** o selo absoluto no chip pode vazar para fora dependendo do padding do container `ingredientsRow`. Mitigação: testar visualmente e ajustar `zIndex` se necessário.
- **home.tsx sem WeeklyCheckinCard:** a correção do modo compact não é visível até a home renderizar o card. A correção será implementada mas testada somente quando a home integrar o card.
