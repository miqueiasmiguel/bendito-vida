## Why

A tela do simulador "Meu Mix" é a feature core do app, mas o visual atual é básico — jarro SVG esquemático, cards de ingredientes genéricos e sem animações de feedback visual ao adicionar grãos. Para a demo do edital, precisamos de um visual profissional e polido que impressione o avaliador. A imagem de referência mostra um design premium com jarro realista, camadas de grãos visíveis empilhadas, ícones ilustrativos dos grãos e label personalizada no jarro.

## What Changes

- **Redesign do MixJar**: Jarro mason-jar mais detalhado e realista com silhueta refinada, tampa com textura, e label "Seu Mix Exclusivo" centralizada no corpo do jarro
- **Camadas de grãos empilhadas visíveis**: Substituir o gradiente linear contínuo por camadas texturizadas empilhadas que representam visualmente cada ingrediente adicionado (com padrão granular por tipo de grão)
- **Animação de grãos caindo**: Ao adicionar um ingrediente, partículas/grãos animados caem de cima para dentro do jarro antes do nível subir — feedback visual satisfatório com Reanimated 4
- **Redesign dos IngredientCards**: Cards mais refinados seguindo o estilo da imagem — ícone do grão maior e mais ilustrativo, tipografia melhorada com informações secundárias (origem), visual mais clean e premium
- **Botões atualizados**: "REINICIAR" (secundário) e "MISTURAR & GERAR RECEITA" (primário) com labels atualizadas e styling mais impactante
- **Header atualizado**: Título "Simulador Meu Mix" + subtítulo "Monte sua mistura funcional"
- **Logo Bendito Grão**: Adicionar branding sutil na parte inferior da tela

## Capabilities

### New Capabilities
- `mix-jar-grain-animation`: Animação de partículas/grãos caindo no jarro ao adicionar ingrediente, usando Reanimated 4

### Modified Capabilities
- `mix-simulator`: Layout, títulos, botões e estrutura geral da tela atualizados para o novo design
- `mix-color-stack`: Camadas de grãos empilhadas com textura visual granular em vez de gradiente linear simples

## Impact

- **Componentes modificados**: `MixJar.tsx`, `IngredientCard.tsx`, `simulator.tsx`
- **Novos componentes possíveis**: Componente de animação de partículas para o jarro
- **Dependências**: Reanimated 4 (já instalado), react-native-svg (já instalado)
- **Performance**: Animação de partículas deve ser otimizada para rodar na UI thread via Reanimated worklets, sem impacto no cálculo nutricional
