## 1. Redesign do MixJar (Jarro SVG)

- [x] 1.1 Redesenhar silhueta SVG do mason-jar em `MixJar.tsx`: corpo arredondado maior (180×220px), pescoço com linhas de rosca, tampa detalhada com textura
- [x] 1.2 Adicionar label "Seu Mix Exclusivo" como `<Text>` SVG centralizado no corpo do jarro, com fade-out quando fillLevel > 60%
- [x] 1.3 Atualizar `<ClipPath>` para nova silhueta do jarro

## 2. Camadas Empilhadas (mix-color-stack)

- [x] 2.1 Substituir `computeGradientStops` por `computeLayerRects` que retorna array de `{ y, height, color, opacity }` para Rects empilhados
- [x] 2.2 Renderizar camadas como `<Rect>` SVG separados dentro do ClipPath, empilhados de baixo para cima
- [x] 2.3 Adicionar linhas separadoras sutis (1px branco 20% opacity) entre camadas
- [x] 2.4 Animar transição de camadas com Reanimated 4 `useAnimatedProps` (height e y)

## 3. Animação de Grãos Caindo

- [x] 3.1 Criar componente `GrainParticles` com 5-8 círculos animados via `useAnimatedStyle` worklets
- [x] 3.2 Implementar queda escalonada (translateY + translateX variável + fade-out) com duração total ~500ms
- [x] 3.3 Integrar `GrainParticles` como overlay absoluto sobre o `MixJar` no `simulator.tsx`
- [x] 3.4 Sequenciar: partículas caem → delay 500ms → nível do jarro sobe (withDelay)
- [x] 3.5 Adicionar haptic feedback (`ImpactFeedbackStyle.Light`) sincronizado com início da animação
- [x] 3.6 Garantir que adições rápidas em sequência funcionem sem conflitos de animação

## 4. Redesign do IngredientCard

- [x] 4.1 Aumentar altura do card de 100px para 120px em `IngredientCard.tsx`
- [x] 4.2 Aumentar círculo do ícone de 40×40px para 44×44px
- [x] 4.3 Adicionar texto de origem: "Nativo da PB" para `isParaibano: true`, origin abreviado para demais
- [x] 4.4 Refinar estilos: borda 1px neutral-200, shadow mais suave (offset(0,1) opacity 0.06 radius 6, elevation 1)

## 5. Header e Botões

- [x] 5.1 Atualizar título para "Simulador Meu Mix" e subtítulo para "Monte sua mistura funcional" (vazio) / "{totalGrams}g no mix" (com itens)
- [x] 5.2 Atualizar label do botão primário para "MISTURAR & GERAR RECEITA" (uppercase)
- [x] 5.3 Atualizar label do botão secundário para "REINICIAR" (uppercase)

## 6. Testes

- [x] 6.1 Atualizar testes do `MixJar` para nova silhueta e camadas empilhadas
- [x] 6.2 Criar teste para `GrainParticles` (renderização e props)
- [x] 6.3 Atualizar teste do `IngredientCard` para nova altura e texto de origem
- [ ] 6.4 Verificar visualmente no device/emulador: animação de partículas, camadas, layout responsivo
