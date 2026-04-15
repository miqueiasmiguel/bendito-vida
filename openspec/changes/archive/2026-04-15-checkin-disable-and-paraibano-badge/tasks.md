## 1. Corrigir reatividade do check-in no progress screen

- [x] 1.1 Em `src/app/(tabs)/progress.tsx`, substituir o selector `(s) => s.getTodayCheckin` por `(s) => s.checkins` e derivar `currentCheckin` localmente com `.find()` usando a data de hoje (`toLocaleDateString('en-CA')`)
- [x] 1.2 Remover a subscrição separada de `getTodayCheckin` do store (não é mais necessária no componente)
- [x] 1.3 Verificar que após o submit, o `WeeklyCheckinCard` passa para read-only imediatamente sem reload

## 2. Desabilitar modo compact na home quando check-in já foi feito

- [x] 2.1 Em `src/app/(tabs)/home.tsx`, subscribar `checkins` do `useProgressStore` e derivar `existingCheckin` localmente (mesmo padrão da task 1.1)
- [x] 2.2 No `WeeklyCheckinCard` compact mode (`src/components/dashboard/WeeklyCheckinCard.tsx`), quando `existingCheckin` estiver presente, substituir o botão "Responder" por um label "Feito hoje ✓" (não clicável, cor `success`, fonte SemiBold caption)
- [x] 2.3 Passar `existingCheckin` ao `WeeklyCheckinCard` compact na home screen

## 3. Unificar selo paraibano no BioactiveMap

- [x] 3.1 Em `src/components/dashboard/BioactiveMap.tsx`, adicionar `import { Leaf } from 'lucide-react-native'`
- [x] 3.2 Substituir o `<View style={styles.badge}><Text>Paraibano</Text></View>` pelo selo circular com `<Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />` em `<View style={styles.leafSeal}>`
- [x] 3.3 Adicionar estilo `leafSeal` ao `StyleSheet`: `position: 'absolute'`, `top: -6`, `left: -6`, `width: 20`, `height: 20`, `borderRadius: 10`, `backgroundColor: colors.primary[700]`, `borderWidth: 1.5`, `borderColor: colors.white`, `alignItems: 'center'`, `justifyContent: 'center'`, `zIndex: 1`
- [x] 3.4 Adicionar `overflow: 'visible'` ao estilo `ingredientChip` para o selo não ser cortado
- [x] 3.5 Remover os estilos `badge` e `badgeText` não mais usados

## 4. Atualizar testes

- [x] 4.1 Atualizar `src/components/dashboard/__tests__/WeeklyCheckinCard.test.tsx`: adicionar caso de teste para modo compact com `existingCheckin` — deve renderizar "Feito hoje ✓" e não renderizar o botão "Responder"
- [x] 4.2 Verificar e atualizar testes existentes de `WeeklyCheckinCard` que possam depender do comportamento antigo do botão "Responder"
- [x] 4.3 Se houver snapshot ou teste de `BioactiveMap`, atualizar para refletir o novo selo (Leaf em vez de texto)
