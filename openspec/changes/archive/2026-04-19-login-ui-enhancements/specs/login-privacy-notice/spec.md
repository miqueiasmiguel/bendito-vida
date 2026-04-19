## ADDED Requirements

### Requirement: Aviso de política de privacidade na tela de login
A tela Welcome (`src/app/index.tsx`) SHALL exibir, abaixo do botão "Entrar com Google", um texto informando que ao entrar o usuário concorda com a política de privacidade. O texto SHALL conter um link clicável que abre `https://miqueiasmiguel.github.io/bendito-vida/privacy-policy.html` no browser externo do dispositivo.

#### Scenario: Aviso é visível na tela de login
- **WHEN** o usuário acessa a tela Welcome e a sessão não está ativa
- **THEN** um texto "Ao entrar você concorda com a política de privacidade" é exibido abaixo do botão, com "política de privacidade" visualmente destacado como link

#### Scenario: Link abre browser externo
- **WHEN** o usuário toca na parte de link do aviso de privacidade
- **THEN** o browser externo do dispositivo é aberto com a URL `https://miqueiasmiguel.github.io/bendito-vida/privacy-policy.html`

#### Scenario: Aviso respeita tamanho mínimo de fonte
- **WHEN** o aviso de privacidade é renderizado
- **THEN** o tamanho da fonte SHALL ser de no mínimo 13px (token `caption`) e o contraste SHALL ser legível sobre o fundo `primary-700`
