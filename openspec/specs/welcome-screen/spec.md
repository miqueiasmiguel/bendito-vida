## ADDED Requirements

### Requirement: Tela Welcome exibe identidade visual Bendito Vida
A tela `src/app/index.tsx` SHALL renderizar sobre background `colors.primary[700]` (#2D6A2E), com logo centralizada (texto "Bendito Vida" em Poppins SemiBold branco ou asset SVG), tagline em Poppins Regular branco, e os dois CTAs: "Começar" e "Já tenho conta".

#### Scenario: Layout em diferentes tamanhos de tela
- **WHEN** o app abre em qualquer device de 5" a 6.7"
- **THEN** logo e botões ficam centrados verticalmente, sem overflow, respeitando safe area

#### Scenario: Background verde cobre toda a tela
- **WHEN** a tela Welcome é renderizada
- **THEN** o background é `colors.primary[700]` preenchendo 100% da viewport incluindo áreas de notch e home indicator

---

### Requirement: Animação de entrada com Reanimated 4
A tela SHALL animar a entrada com `useSharedValue` + `withSpring`: logo escala de 0 para 1, e elementos decorativos (3-5 "grãos" representados por círculos coloridos) caem de cima para baixo com `withDelay` + `withTiming`. Nenhuma animação SHALL usar a API `Animated` do React Native core.

#### Scenario: Logo anima ao montar
- **WHEN** a tela Welcome é montada
- **THEN** a logo inicia com `scale: 0` e anima até `scale: 1` com efeito spring (stiffness ~100, damping ~15)

#### Scenario: Grãos decorativos caem após logo
- **WHEN** a animação de logo começa
- **THEN** 4 círculos decorativos animam com delay escalonado (0ms, 100ms, 200ms, 300ms), translating de -30 para 0 em Y com opacity 0→1

---

### Requirement: Botão "Começar" navega para registro
O botão "Começar" SHALL usar o componente `Button` com `variant="primary"` (bg `colors.accent[500]`, texto branco, radius 24) e ao ser pressionado navegar para `/(auth)/register`.

#### Scenario: Toque em "Começar"
- **WHEN** o usuário toca em "Começar"
- **THEN** o app navega para `/(auth)/register`

#### Scenario: Feedback háptico em "Começar"
- **WHEN** o usuário toca em "Começar"
- **THEN** `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` é disparado

---

### Requirement: Link "Já tenho conta" navega para login
O link "Já tenho conta" SHALL ser um `TouchableOpacity` com texto em Poppins Regular branco (underline) e ao ser pressionado navegar para `/(auth)/login`.

#### Scenario: Toque em "Já tenho conta"
- **WHEN** o usuário toca em "Já tenho conta"
- **THEN** o app navega para `/(auth)/login`

---

### Requirement: Componente Button cobre variantes primary e secondary
`src/components/ui/Button.tsx` SHALL aceitar props `variant: 'primary' | 'secondary'`, `onPress`, `label` (string), e `disabled` (boolean). SHALL ter touch area mínima de 44x44, `accessibilityRole="button"`, `accessibilityLabel` igual ao `label`, e 1 teste unitário via Jest.

#### Scenario: Renderiza variante primary
- **WHEN** `<Button variant="primary" label="Começar" onPress={fn} />` é renderizado
- **THEN** o background é `colors.accent[500]` e o texto é branco

#### Scenario: Renderiza variante secondary
- **WHEN** `<Button variant="secondary" label="Cancelar" onPress={fn} />` é renderizado
- **THEN** o background é transparente, border é `colors.primary[700]` 1.5px, texto é `colors.primary[700]`

#### Scenario: Estado desabilitado
- **WHEN** `disabled={true}`
- **THEN** opacidade é 0.5 e `onPress` não dispara
