## MODIFIED Requirements

### Requirement: Tela Welcome com botão Google Sign-In
A tela Welcome (`src/app/index.tsx`) SHALL exibir um único botão "Entrar com Google" no lugar dos botões "Começar" e "Já tenho conta". Não SHALL existir formulários de email, senha ou telas de login/cadastro separadas. O botão SHALL exibir o ícone oficial do Google (colorido) à esquerda do texto.

#### Scenario: Tela renderiza com botão Google
- **WHEN** o usuário acessa a tela Welcome (`/`)
- **THEN** a tela exibe logo do app, texto de boas-vindas e um botão "Entrar com Google" visível, sem botões "Começar" ou "Já tenho conta"

#### Scenario: Botão exibe ícone do Google
- **WHEN** o botão "Entrar com Google" é renderizado
- **THEN** o ícone colorido do Google SHALL aparecer à esquerda do texto "Entrar com Google" dentro do botão

#### Scenario: Botão respeita touch area mínima
- **WHEN** o botão "Entrar com Google" é renderizado
- **THEN** sua área de toque SHALL ser de no mínimo 44x44 pontos
