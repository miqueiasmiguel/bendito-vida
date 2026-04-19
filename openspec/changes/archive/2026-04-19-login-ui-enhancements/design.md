## Context

A tela Welcome (`src/app/index.tsx`) é a tela de entrada do app e funciona como tela de login. Ela exibe um botão "Entrar com Google" que utiliza o componente `Button` (`src/components/ui/Button.tsx`). O componente atual suporta apenas `label` (texto) — não há suporte a ícone. O projeto já depende de `react-native-svg` (via Expo), então um SVG inline do logo Google é viável sem nova dependência.

## Goals / Non-Goals

**Goals:**
- Exibir o ícone oficial do Google (colorido) à esquerda do texto no botão de login
- Exibir texto de aviso de política de privacidade com link clicável abaixo do botão
- Manter conformidade com o design system (tokens de cor, tipografia, spacing)

**Non-Goals:**
- Alterar a lógica de autenticação ou o fluxo OAuth
- Refatorar o componente `Button` para uso genérico com ícones (scope desta mudança é apenas o botão Google)
- Internacionalização ou múltiplos idiomas

## Decisions

### Ícone Google: SVG inline na tela vs. prop `leftIcon` no Button

**Decisão:** Adicionar prop `leftIcon?: React.ReactNode` ao componente `Button` e passar o SVG do Google a partir de `index.tsx`.

**Rationale:** O `Button` é um componente genérico de UI e outras telas podem precisar de botões com ícone. Adicionar `leftIcon` é uma extensão natural sem quebrar a interface existente (prop opcional). Alternativa descartada — SVG diretamente no `index.tsx` sem alterar `Button` — criaria um botão customizado paralelo que duplica estilos e viola o protocolo de criação de componentes.

### Ícone Google: SVG inline vs. imagem PNG/JPEG

**Decisão:** SVG inline via `react-native-svg` (componente `GoogleIcon` em `src/components/ui/GoogleIcon.tsx`).

**Rationale:** SVG garante nitidez em todas as densidades de tela sem asset extra. `react-native-svg` já está no projeto (dependência do Expo). PNG/JPEG exigiria asset gerenciado e poderia ficar pixelado.

### Aviso de privacidade: `Text` com `Linking.openURL` vs. `TouchableOpacity`

**Decisão:** `Text` com `onPress` e `Linking.openURL` para abrir o link externamente.

**Rationale:** Padrão do ecossistema RN para links inline em texto. `Linking` já está disponível no core do RN, sem dependência adicional. O texto de aviso é renderizado diretamente em `index.tsx` — não justifica componente separado dado seu escopo único.

## Risks / Trade-offs

- [Alteração no `Button`] Prop `leftIcon` é opcional e retrocompatível — sem risco de regressão nos usos existentes. → Mitigação: todos os usos atuais do `Button` continuam funcionando sem alteração.
- [SVG inline] O logo do Google tem cores específicas que não seguem o design system — necessário usar cores hardcoded apenas para esse ícone. → Aceitável: é um ícone de marca de terceiro, não um elemento do design system.
- [Link externo] `Linking.openURL` pode falhar silenciosamente em alguns emuladores Android sem browser. → Mitigação: envolver em try/catch; em produção, dispositivos reais sempre terão browser.
