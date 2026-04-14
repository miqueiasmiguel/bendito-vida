## 1. Atualizar IngredientCard

- [x] 1.1 Ler `src/components/simulator/IngredientCard.tsx` para entender a estrutura atual do badge de texto
- [x] 1.2 Remover o badge-pílula de texto "Paraibano" (view + texto com `primary-100` bg)
- [x] 1.3 Adicionar o selo circular: `View` 20×20px, `borderRadius: 10`, `bg: primary-700`, `position: absolute`, `top: -6`, `left: -6`, `borderWidth: 1.5`, `borderColor: white`
- [x] 1.4 Adicionar ícone `<Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />` centralizado dentro da bolinha
- [x] 1.5 Garantir `overflow: 'visible'` no container do card (para o selo vazar para fora da borda)

## 2. Ajustar ScrollView container

- [x] 2.1 Verificar o `ScrollView` em `src/app/(tabs)/simulator.tsx` (ou onde a lista é renderizada) e adicionar `paddingLeft` (mínimo 8px) para o selo do primeiro card não ser cortado

## 3. Atualizar testes

- [x] 3.1 Ler e atualizar os testes unitários do `IngredientCard` para verificar que o ícone `Leaf` é renderizado quando `isParaibano: true` (em vez do texto "Paraibano")
- [x] 3.2 Verificar que os testes verificam ausência do texto "Paraibano" no novo visual

## 4. Validação

- [x] 4.1 Rodar `npm test` e garantir que todos os testes passam
- [ ] 4.2 Inspecionar visualmente no simulador: selo visível, sem corte no primeiro card, contraste OK quando selecionado
