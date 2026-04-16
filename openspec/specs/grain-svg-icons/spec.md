### Requirement: Biblioteca de ícones SVG por ingrediente
Cada ingrediente listado em `src/data/ingredients.ts` SHALL ter um componente SVG React Native dedicado em `src/assets/icons/grains/`. Os 12 ícones obrigatórios são: `GergelimIcon`, `FeijaoVerdeIcon`, `ChiaIcon`, `AmendoimIcon`, `GirassolIcon`, `LinhacaIcon`, `CastanhaCajuIcon`, `FeijaoFradinhoIcon`, `SorgoIcon`, `MilhoPalhaIcon`, `QuinoaIcon`, `AcerolaIcon`. Cada componente SHALL aceitar as props `size: number` (padrão 24) e `color: string` (padrão `'#FFFFFF'`), e SHALL renderizar uma ilustração reconhecível do grão/semente usando primitivos do `react-native-svg` (`Svg`, `Path`, `Circle`, `Ellipse`, `Rect`, `G`). O viewport SHALL ser `0 0 24 24`. O strokeWidth SHALL ser entre 1.5 e 2. O estilo SHALL ser linha orgânica minimalista (consistente com Lucide).

#### Scenario: Ícone renderiza na dimensão solicitada
- **WHEN** o componente é renderizado com `size={28}`
- **THEN** o SVG ocupa exatamente 28×28px e o conteúdo escala proporcionalmente ao viewport 24×24

#### Scenario: Ícone renderiza na cor solicitada
- **WHEN** o componente é renderizado com `color="#FFFFFF"`
- **THEN** o traço/preenchimento do ícone usa a cor fornecida

#### Scenario: Ícone é visualmente distinguível
- **WHEN** os 12 ícones são exibidos lado a lado
- **THEN** cada ícone é reconhecível como representação do seu ingrediente (gergelim ≠ chia ≠ feijão etc.)

---

### Requirement: Componente GrainIcon com registro centralizado e fallback
Um componente `GrainIcon` SHALL existir em `src/components/ui/GrainIcon.tsx` e SHALL ser exportado via `src/components/ui/index.ts`. O componente SHALL aceitar as props: `ingredientId: string`, `size?: number` (padrão 24), `color?: string` (padrão `'#FFFFFF'`). Internamente, um `GRAIN_ICON_MAP: Record<string, React.FC<GrainIconBaseProps>>` SHALL mapear cada `ingredient.id` ao seu componente de ícone correspondente. Quando o `ingredientId` não existir no mapa, o componente SHALL renderizar o `GenericGrainIcon` (semente genérica) como fallback silencioso sem erro. O arquivo SHALL conter um comentário indicando como registrar novos grãos.

#### Scenario: Ingrediente conhecido renderiza seu ícone personalizado
- **WHEN** `<GrainIcon ingredientId="chia" size={28} />` é renderizado
- **THEN** o `ChiaIcon` é exibido com tamanho 28

#### Scenario: Ingrediente desconhecido renderiza fallback genérico
- **WHEN** `<GrainIcon ingredientId="novo-grao-sem-icone" size={28} />` é renderizado
- **THEN** o `GenericGrainIcon` é exibido sem erro ou warning

#### Scenario: GrainIcon exportado via index.ts
- **WHEN** um componente importa de `@/components/ui`
- **THEN** `GrainIcon` está disponível no export barrel
