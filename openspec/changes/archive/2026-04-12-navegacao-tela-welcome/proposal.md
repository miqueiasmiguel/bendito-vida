## Why

O app ainda não possui telas navegáveis — o projeto está com a infra configurada mas sem nenhuma UI. Para a demo do edital, o avaliador precisa ver o fluxo de entrada: splash/welcome → autenticação → tabs principais. Implementar a navegação base e a Tela Welcome é o passo zero para qualquer feature subsequente.

## What Changes

- Criar o root layout (`src/app/_layout.tsx`) com providers (Expo Router, gesture handler, safe area)
- Criar layout de autenticação (`src/app/(auth)/_layout.tsx`)
- Criar layout de onboarding (`src/app/(onboarding)/_layout.tsx`)
- Criar layout de tabs nativas (`src/app/(tabs)/_layout.tsx`) com 4 abas: Home, Meu Mix, Evolução, Perfil
- Criar tela Welcome (`src/app/index.tsx`) — splash com logo, animação Reanimated 4, botões "Começar" e "Já tenho conta"
- Criar telas placeholder para rotas que ainda não existem (auth, tabs, onboarding) para que a navegação não quebre
- Configurar tema + componentes UI base necessários para a Welcome funcionar (Button, cores, tipografia)

## Capabilities

### New Capabilities

- `app-navigation`: Estrutura de roteamento completa com Expo Router — root layout, grupos (auth), (onboarding), (tabs) e placeholders para cada rota
- `welcome-screen`: Tela de entrada do app com identidade visual Bendito Vida, animação de logo e CTAs para registro/login

### Modified Capabilities

## Impact

- **Arquivos criados:** `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/(auth)/_layout.tsx`, `src/app/(onboarding)/_layout.tsx`, `src/app/(tabs)/_layout.tsx`, telas placeholder
- **Tema:** `src/theme/` (colors, typography, spacing) deve existir antes das telas
- **Componentes UI:** `src/components/ui/Button.tsx` necessário para os CTAs
- **Dependências:** expo-router (já instalado), react-native-reanimated 4, react-native-safe-area-context, expo-haptics, lucide-react-native
- **Nenhuma API/backend necessária nesta etapa** — navegação é 100% local
