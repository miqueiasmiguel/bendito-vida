## Why

A tela de login (`src/app/index.tsx`) exibe o botão "Entrar com Google" sem o ícone oficial do Google e sem qualquer menção à política de privacidade — ambos esperados por usuários e exigidos pelas diretrizes do Google e da Play Store. Esse ajuste melhora a confiança do usuário e a conformidade legal antes do lançamento.

## What Changes

- Adicionar ícone do Google (SVG inline ou componente Lucide/imagem) ao botão "Entrar com Google" na tela Welcome/login
- Adicionar texto de aviso de privacidade abaixo do botão com link clicável para `https://miqueiasmiguel.github.io/bendito-vida/privacy-policy.html`
- O texto deve ser: "Ao entrar você concorda com a [política de privacidade](link)"

## Capabilities

### New Capabilities

- `login-privacy-notice`: Exibe aviso de política de privacidade com link clicável abaixo do botão de login

### Modified Capabilities

- `google-sign-in`: Botão "Entrar com Google" passa a exibir ícone do Google à esquerda do texto

## Impact

- `src/app/index.tsx` — adicionar ícone ao botão e renderizar aviso de privacidade
- `src/components/ui/Button.tsx` — possivelmente adicionar suporte a prop `leftIcon` se não existir
- Nenhuma dependência nova necessária (ícone pode ser SVG inline com `react-native-svg` já disponível)
