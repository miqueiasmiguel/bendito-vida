## Context

O `IngredientCard` atualmente exibe um badge-pílula de texto ("Paraibano") em `primary-100` bg + `primary-700` text quando `isParaibano === true`. O card é compacto (scroll horizontal) e o badge ocupa uma linha inteira abaixo do nome, aumentando a altura do card e fragmentando a hierarquia visual.

A mudança é puramente visual e confinada a um único componente.

## Goals / Non-Goals

**Goals:**
- Substituir o badge-pílula de texto por um ícone-selo circular (`Leaf` da Lucide, branco, sobre fundo `primary-700`) posicionado absolutamente no canto superior esquerdo do card.
- Manter o card com a mesma área de toque e altura base (o selo sobrepõe a borda, não empurra conteúdo).
- Alinhar ao padrão visual de "notificação/selo" reconhecível por qualquer usuário de smartphone.

**Non-Goals:**
- Mudança na lógica de seleção, dados ou store.
- Animação do selo (estático é suficiente para o MVP).
- Alteração de outros badges no app.

## Decisions

### Posicionamento absoluto com overflow visível

**Decisão:** `position: 'absolute'`, `top: -6`, `left: -6`, diâmetro 20px. O container do card recebe `overflow: 'visible'` para o selo vazar levemente para fora.

**Por quê:** Cria o efeito de notificação/selo sem alterar o layout interno do card. Alternativa considerada: colocar o selo dentro do card com `zIndex` — descartada porque reduziria a área de conteúdo e perderia o efeito de sobreposição da borda.

### Ícone Leaf da Lucide

**Decisão:** `<Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />` centralizado na bolinha.

**Por quê:** Lucide já é dependência do projeto. O ícone de folha reforça a identidade orgânica/natural do app. Alternativa: emoji 🌿 — descartada por inconsistência de renderização entre plataformas.

### Tamanho do selo: 20px de diâmetro

**Decisão:** Bolinha de 20×20px, `borderRadius: 10`.

**Por quê:** Grande o suficiente para ser visível sem obstruir o nome do ingrediente. Proporcional ao card compacto do scroll horizontal. Referência: badges de notificação do iOS têm ~16–20px.

## Risks / Trade-offs

- **Overflow cortado em ScrollView:** `ScrollView` com `horizontal` pode cortar overflow do primeiro/último card. Mitigação: adicionar `paddingHorizontal` ou `paddingLeft` no `ScrollView` container para dar espaço ao selo (verificar no device/simulator).
- **Colisão visual com borda de seleção:** quando o card tem `borderColor: primary-700` (selecionado), o selo verde sobre borda verde pode diluir o contraste. Mitigação: adicionar um anel branco de 1.5px (`borderWidth: 1.5, borderColor: white`) ao redor da bolinha para separá-la da borda do card.
