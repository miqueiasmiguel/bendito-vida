## MODIFIED Requirements

### Requirement: Grupos de rota existem e não causam crash
Os grupos `(auth)`, `(onboarding)` e `(tabs)` SHALL ter `_layout.tsx` próprios que renderizam `<Stack />` ou `<Tabs />` respectivamente, de modo que qualquer navegação para rotas dentro desses grupos não resulte em erro de rota não encontrada. O grupo `(onboarding)` SHALL ter `_layout.tsx` com `<Stack screenOptions={{ headerShown: false }} />`. O grupo `(auth)` poderá ter apenas `_layout.tsx` sem rotas filhas visíveis após a remoção de `login` e `register`.

#### Scenario: Tabs layout renderiza 4 abas
- **WHEN** o usuário acessa qualquer rota dentro de `/(tabs)/`
- **THEN** a barra de tabs aparece com ícones: Home (House), Meu Mix (FlaskConical), Evolução (TrendingUp), Perfil (User)

#### Scenario: Cor ativa das tabs
- **WHEN** uma aba está selecionada
- **THEN** seu ícone e label usam `colors.primary[700]` (#2D6A2E); as demais usam `colors.neutral[400]`

#### Scenario: Navegação para rota de onboarding
- **WHEN** o usuário é direcionado para `/(onboarding)/quiz`
- **THEN** a tela renderiza sem crash e sem header visível

## REMOVED Requirements

### Requirement: Telas placeholder não bloqueiam navegação
**Reason**: As rotas `(auth)/login` e `(auth)/register` são removidas. A autenticação Google é acionada diretamente da tela Welcome (`index.tsx`), sem telas de auth separadas.
**Migration**: Remover arquivos `src/app/(auth)/login.tsx` e `src/app/(auth)/register.tsx`. Remover qualquer referência a `/(auth)/login` ou `/(auth)/register` no codebase.
