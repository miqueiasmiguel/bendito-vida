## Context

A tela do simulador "Meu Mix" (`src/app/(tabs)/simulator.tsx`) é composta por 3 componentes principais: `MixJar` (jarro SVG), `IngredientCard` (grid de ingredientes) e `NudgeAlert` (toast). O jarro atual é um SVG esquemático com gradiente linear simples. Os cards são funcionais mas visuais básicos. Não há animação de feedback ao adicionar grãos — apenas flash de cor no card.

A imagem de referência mostra um design premium com:
- Jarro mason-jar detalhado com label "Seu Mix Exclusivo"
- Camadas de grãos empilhadas e visualmente distintas dentro do jarro
- Cards de ingredientes com layout mais limpo e informação de origem
- Dois botões explícitos: "REINICIAR" e "MISTURAR & GERAR RECEITA"

## Goals / Non-Goals

**Goals:**
- Visual premium e polido que impressione na demo do edital
- Jarro com aparência realista e camadas de grãos empilhadas visíveis
- Animação satisfatória de grãos caindo ao adicionar ingrediente (Reanimated 4, UI thread)
- Cards de ingredientes com design refinado seguindo imagem de referência
- Manter toda a lógica funcional existente (addGrams, removeIngredient, nudges, cálculo nutricional)

**Non-Goals:**
- Não redesenhar fluxo de interação (toque para add/badge para remove continua igual)
- Não alterar dados nutricionais ou engine de cálculo
- Não implementar drag & drop
- Não mudar estrutura de navegação ou rotas
- Não alterar NudgeAlert (já funciona bem)

## Decisions

### 1. Jarro SVG redesenhado inline (não imagem raster)

**Decisão:** Redesenhar o jarro como SVG mais detalhado diretamente no componente `MixJar.tsx`, com silhueta mason-jar mais realista, tampa com textura de linhas, e label "Seu Mix Exclusivo" como `<Text>` SVG centralizado.

**Alternativas consideradas:**
- Imagem PNG/WebP do jarro: Mais fiel à referência, mas perde a capacidade de animar fill/camadas internamente e aumenta bundle size.
- Biblioteca de ilustrações 3D: Overengineering para MVP.

**Rationale:** SVG mantém animabilidade das camadas internas, escala perfeita em qualquer resolução, e permite interação direta entre fill animado e contorno do jarro.

### 2. Camadas empilhadas com segmentos de Rect coloridos (não gradiente contínuo)

**Decisão:** Substituir o `LinearGradient` contínuo por múltiplos `<Rect>` empilhados verticalmente dentro do `ClipPath` do jarro. Cada ingrediente no mix gera um Rect com:
- Cor sólida do ingrediente (`ingredient.color`)
- Altura proporcional ao peso relativo (grams / totalGrams * fillHeight)
- Padrão de textura sutil via opacidade variável ou overlay pattern SVG para simular grãos

**Alternativas consideradas:**
- Manter gradiente com hard stops: Visualmente menos impactante que rects separados.
- Texturas bitmap por tipo de grão: Complexidade excessiva, difícil animar.

**Rationale:** Rects empilhados são simples de animar individualmente com Reanimated, dão a aparência de camadas distintas como na imagem, e permitem adicionar textura sutil sem complexidade.

### 3. Animação de grãos caindo com partículas Reanimated

**Decisão:** Ao adicionar um ingrediente, spawnar 5-8 pequenos círculos/dots na cor do ingrediente acima do jarro. Usar `withTiming` + `withDelay` escalonado para animar queda (translateY) + fade-out. Partículas rodam inteiramente na UI thread via `useAnimatedStyle`. Após partículas desaparecerem (~400ms), o nível do jarro sobe com a animação existente de 300ms.

**Alternativas consideradas:**
- Lottie animation: Dependência extra, difícil customizar cores dinamicamente por ingrediente.
- Canvas/Skia: Poderoso mas overkill; react-native-skia adicionaria dependência pesada.
- Apenas expandir o flash do card: Não dá o feedback visual "grão entrando no jarro" que a referência sugere.

**Rationale:** Reanimated 4 já está instalado, partículas simples com circles são leves, rodam na UI thread, e a cor se adapta dinamicamente ao ingrediente selecionado.

### 4. IngredientCard redesenhado com informações de origem

**Decisão:** Manter estrutura do card mas refinar visual:
- Aumentar altura do card para ~120px para acomodar info adicional
- Manter ícone GrainIcon sobre círculo colorido (já existente)
- Adicionar linha secundária com texto de origem abreviado (ex: "Nativo da PB", "Regular Body")
- Tipografia mais refinada: nome em SemiBold, origem em caption neutral-400
- Border mais sutil (1px neutral-200), shadow mais suave
- Manter badge de quantidade e selo paraibano como estão

**Rationale:** Aproveita componentes existentes (GrainIcon, badge, selo) e adiciona polish visual sem reescrever a lógica.

### 5. Botões e header atualizados

**Decisão:** 
- Header: "Simulador Meu Mix" (H2 SemiBold) + "Monte sua mistura funcional" (caption)
- Botão primário: "MISTURAR & GERAR RECEITA" (uppercase, accent-500)
- Botão secundário: "REINICIAR" (uppercase, já existe como "Limpar Mix")

**Rationale:** Alinha com a imagem de referência. Labels mais impactantes para demo.

## Risks / Trade-offs

- **[Perf] Animação de partículas em devices low-end** → Mitigação: limitar a 6 partículas max, usar `useAnimatedStyle` worklet-only, sem re-renders React. Testar em device real.
- **[Visual] Camadas empilhadas podem parecer flat sem textura** → Mitigação: adicionar variação sutil de opacidade (0.85-1.0) e linha separadora fina (0.5px, branco 20% opacity) entre camadas.
- **[Complexidade] Coordenação temporal partículas → fill level** → Mitigação: usar `withDelay` para iniciar animação de fill após partículas completarem. Sequência controlada pelo mesmo trigger (addGrams).
- **[Regressão] Mudanças no MixJar podem quebrar ClipPath** → Mitigação: manter testes existentes do MixJar, testar visualmente no device.
