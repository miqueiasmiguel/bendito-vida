## Context

O `IngredientCard` atual renderiza um `View` circular com a cor do ingrediente (`colorDot`, 28×28px) como único elemento visual identificador. O app tem 12 ingredientes, todos com cores únicas, mas sem ilustrações. A stack já inclui `react-native-svg` (usada pelo `MixJar`), então nenhuma dependência nova é necessária.

O desafio principal é criar ícones que sejam: (1) legíveis em 28×28px dentro do card, (2) consistentes em estilo, (3) extensíveis para futuros grãos, e (4) renderizados na UI thread sem assets externos.

## Goals / Non-Goals

**Goals:**
- Cada um dos 12 ingredientes atuais terá um componente SVG React Native único e ilustrativo.
- Um componente `GrainIcon` centralizado recebe o `id` do ingrediente e renderiza o ícone correto (com fallback genérico para ids desconhecidos).
- O `IngredientCard` substitui o `colorDot` pelo componente `GrainIcon`, mantendo o `color` do ingrediente como fundo circular.
- Adicionar um novo grão no futuro requer: criar `XxxIcon.tsx`, registrar no mapa do `GrainIcon`.

**Non-Goals:**
- Animações internas nos ícones SVG (os ícones são estáticos).
- Ícones com mais de uma variante (ex: light/dark mode) — o fundo colorido já cuida do contraste.
- Substituição do campo `color` no tipo `Ingredient` — ele continua sendo usado para o jarro e o RecipeCard.
- Ícones em formatos de arquivo externos (`.svg`, `.png`) — tudo permanece como componente React Native para evitar problemas de bundling no Expo.

## Decisions

### D1: Ícones como componentes React Native SVG (não assets de arquivo)
**Decisão:** Cada ícone é um arquivo `.tsx` em `src/assets/icons/grains/` exportando um componente funcional que usa primitivos do `react-native-svg` (`Svg`, `Path`, `Circle`, `Ellipse`, `Rect`).

**Alternativa considerada:** Arquivos `.svg` importados via `react-native-svg-transformer`. Descartado porque requer configuração adicional no `metro.config.js` e há risco de incompatibilidade com Expo SDK 55 New Architecture.

**Racional:** Componentes `.tsx` são zero-config, type-safe, permitem props dinâmicas (tamanho, cor de fundo) e são testáveis com Jest nativamente.

---

### D2: Componente `GrainIcon` com mapa de registro
**Decisão:** Um arquivo `src/components/ui/GrainIcon.tsx` mantém um `Record<string, React.FC<GrainIconProps>>` mapeando `ingredient.id` → componente. Novos grãos são adicionados inserindo uma entrada nesse mapa.

**Alternativa considerada:** Colocar o ícone diretamente no objeto `Ingredient` (campo `icon: React.FC`). Descartado porque mistura dados com apresentação, dificulta serialização/persistência e quebra o princípio de separação de preocupações.

**Racional:** O mapa centraliza o registro, mantém `ingredients.ts` como dado puro, e o `GrainIcon` se torna o único ponto de acoplamento entre dados e visualização.

---

### D3: Ícone renderizado sobre fundo circular colorido
**Decisão:** O `IngredientCard` continua renderizando um `View` circular com `backgroundColor: ingredient.color`, e o `GrainIcon` é renderizado sobre ele com ícone branco/claro para contraste.

**Alternativa considerada:** Fundo branco para todos os ícones com o ícone na cor do ingrediente. Descartado porque perde a identidade visual colorida que já é usada no jarro e no RecipeCard.

**Racional:** Mantém a paleta de cores como linguagem visual consistente e o ícone SVG adiciona identidade sem eliminar a cor.

---

### D4: Estilo de ilustração — linha orgânica minimalista
**Decisão:** Ícones com estilo de linha orgânica, `strokeWidth` 1.5–2, sem preenchimento sólido (ou preenchimento leve), cor branca/neutra para contrastar com o fundo colorido. Dimensão canônica: viewport 24×24, escalável via prop `size`.

**Racional:** Consistente com o uso de Lucide no restante do app (mesmos parâmetros de stroke). Legível em 28×28px. Orgânico e acolhedor, alinhado à identidade visual do Bendito Vida.

---

### D5: Fallback genérico para grãos sem ícone
**Decisão:** O componente `GrainIcon` renderiza um ícone genérico de "grão" (um círculo com detalhes de semente) para qualquer `id` não registrado no mapa.

**Racional:** Garante que futuros ingredientes adicionados em `ingredients.ts` não quebrem o UI enquanto o ícone personalizado ainda não foi criado.

## Risks / Trade-offs

- **Tamanho do bundle:** 12 componentes SVG adicionam ~5–15KB ao bundle JS. Risco baixo para um app mobile de conteúdo limitado. → Sem mitigação necessária.
- **Legibilidade em 28×28px:** Ícones muito detalhados podem ficar ilegíveis nesse tamanho. → Mitigação: usar formas simples, strokeWidth ≥ 1.5, e testar visualmente no simulador antes de finalizar cada ícone.
- **Manutenção do mapa:** Se alguém adicionar um ingrediente em `ingredients.ts` sem registrar o ícone, o fallback é silencioso (sem erro). → Mitigação: comentário claro no `GrainIcon.tsx` com instruções de como adicionar novo grão.
