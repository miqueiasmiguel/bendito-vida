## Why

Os cards de ingredientes atualmente usam apenas um círculo colorido para representar cada grão, resultando numa aparência genérica que não comunica identidade visual. Ícones SVG ilustrativos por ingrediente tornam o simulador mais profissional, informativo e alinhado à identidade "orgânico e acolhedor" do Bendito Vida.

## What Changes

- Criação de um conjunto de ícones SVG únicos para cada um dos 12 ingredientes atuais (`gergelim`, `feijao-verde`, `chia`, `amendoim`, `girassol`, `linhaca`, `castanha-caju`, `feijao-fradinho`, `sorgo`, `milho-palha`, `quinoa`, `acerola`) e um ícone genérico para futuros grãos.
- Novo campo `icon` adicionado ao tipo `Ingredient` apontando para o componente SVG de cada grão.
- O `IngredientCard` passa a renderizar o ícone SVG no lugar do círculo de cor sólida, mantendo o círculo colorido apenas como fundo do ícone.
- Todos os ícones são renderizados com `react-native-svg` (já disponível na stack) como componentes React nativos — zero dependência nova.
- Um componente `GrainIcon` genérico serve de fallback para ingredientes futuros que ainda não tenham ícone personalizado.
- Nenhuma quebra de contrato de dado — o campo `color` permanece e continua sendo usado como fundo do ícone.

## Capabilities

### New Capabilities

- `grain-svg-icons`: Biblioteca de ícones SVG ilustrativos para cada ingrediente, com componente `GrainIcon` para renderização padronizada e fallback para grãos futuros.

### Modified Capabilities

- `mix-simulator`: O `IngredientCard` passa a receber e renderizar o ícone SVG do grão, substituindo o círculo de cor plana por uma representação ilustrativa.

## Impact

- **`src/data/ingredients.ts`**: adição do campo `icon` no tipo `Ingredient` referenciando o componente SVG correspondente.
- **`src/components/simulator/IngredientCard.tsx`**: substituição do círculo de cor sólida pelo componente `GrainIcon`.
- **`src/components/ui/GrainIcon.tsx`** _(novo)_: componente genérico de renderização de ícone de grão com fallback.
- **`src/assets/icons/grains/`** _(novo)_: 12 arquivos de componente SVG (`GergelimIcon.tsx`, `ChiaIcon.tsx`, etc.).
- Dependências: `react-native-svg` (já instalada), sem novas dependências.
- Nenhuma mudança de API pública de stores ou navegação.
