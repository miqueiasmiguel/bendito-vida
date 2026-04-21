## Requirements

### Requirement: Card de acesso rápido ao Simulador na Home
O `SimulatorCtaCard` SHALL ser um card visual com fundo `primary-700`, headline "Monte seu Mix do dia", subtítulo descritivo e botão primário (accent) "Montar meu Mix" que navega para `/(tabs)/simulator`.

#### Scenario: Renderização padrão
- **WHEN** o componente é renderizado na Home
- **THEN** exibe fundo `primary-700`, ícone de frasco (`<FlaskConical />` Lucide, size=32, cor `neutral-50`), headline branca "Monte seu Mix do dia", subtítulo "Combine ingredientes e descubra a mistura ideal para você" em cor `primary-100`, e botão primário "Montar meu Mix"

#### Scenario: Toque no botão ou no card
- **WHEN** o usuário toca no botão "Montar meu Mix" ou em qualquer área do card
- **THEN** o app navega para `/(tabs)/simulator`

---

### Requirement: Aparência premium do SimulatorCtaCard
O `SimulatorCtaCard` SHALL usar radius 16px (padrão de cards), padding 20px, e sombra `offset(0,4) opacity 0.15 radius 12 elevation 4` para destacá-lo dos demais cards da tela.

#### Scenario: Elevação visual maior que cards comuns
- **WHEN** o card é renderizado junto com outros cards na Home
- **THEN** sua sombra e elevação são visivelmente maiores que os cards `primary-100` padrão

---

### Requirement: Acessibilidade do SimulatorCtaCard
O `SimulatorCtaCard` SHALL ter `accessibilityRole="button"` e `accessibilityLabel="Montar meu Mix — acessar simulador"`.

#### Scenario: Label de acessibilidade presente
- **WHEN** o card é renderizado
- **THEN** possui `accessibilityLabel` que descreve a ação e o destino
