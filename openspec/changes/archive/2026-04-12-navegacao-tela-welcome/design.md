## Context

O projeto tem infra configurada (ESLint, Prettier, Jest, Husky, CI) mas nenhuma tela. Expo Router exige uma estrutura de pastas específica em `src/app/` para gerar as rotas. O design system (cores, tipografia, espaçamento) precisa existir antes de qualquer componente visual. Reanimated 4 é obrigatório no SDK 55.

## Goals / Non-Goals

**Goals:**
- Estrutura de navegação completa e funcional com Expo Router (root layout + grupos)
- Tela Welcome com identidade visual correta e animação de entrada
- Tema base (tokens) e componente Button funcionando
- Todas as rotas resolvem sem crash (telas placeholder onde necessário)

**Non-Goals:**
- Implementar Auth real com Supabase (apenas navegação para as rotas)
- Quiz, Home, Simulador ou qualquer outra tela além da Welcome
- Internacionalização ou suporte a múltiplos temas

## Decisions

### 1. Estrutura de pastas primeiro, telas depois

Criar `_layout.tsx` para cada grupo antes de qualquer tela de conteúdo. O Expo Router em SDK 55 usa `src/app/` como raiz — qualquer arquivo fora dessa convenção causa erro de build.

**Alternativa considerada:** colocar tudo em `/app` na raiz. **Rejeitado** — CLAUDE.md proíbe explicitamente.

### 2. Tema como módulo TypeScript puro (sem StyleSheet global)

`src/theme/index.ts` exporta objetos `colors`, `typography`, `spacing` com tokens nomeados. Componentes importam via `@/theme`. Sem CSS-in-JS ou styled-components.

**Alternativa considerada:** NativeWind/Tailwind. **Rejeitado** — adiciona complexidade desnecessária para o MVP e o CLAUDE.md não lista na stack.

### 3. Animação Welcome com Reanimated 4 (`useSharedValue` + `withSpring`)

Logo entra com `withSpring` (scale 0→1) e os grãos caem com `withDelay` + `withTiming`. Tudo no UI thread via `useAnimatedStyle`. **Nunca** usar `Animated` do RN core.

**Alternativa considerada:** CSS animations via `Animated.loop`. **Rejeitado** — incompatível com New Architecture e Reanimated 4.

### 4. Placeholders explícitos para rotas não implementadas

Cada tela ainda não implementada (`(auth)/login`, `(auth)/register`, `(onboarding)/quiz`, `(tabs)/home`, etc.) recebe um componente mínimo com `<Text>Em breve</Text>` para evitar erro 404 de rota. Isso permite navegar e testar sem crash.

### 5. Button como componente único com variante por prop

`Button` aceita `variant: 'primary' | 'secondary'`. Primary = bg accent-500, Secondary = bordered primary-700. Evita criar dois componentes separados e segue o padrão do design system.

## Risks / Trade-offs

- **[Risk] Reanimated 4 ainda é novo** → Mitigation: seguir a API `useSharedValue`/`useAnimatedStyle` documentada no SDK 55; evitar APIs experimentais.
- **[Risk] Expo Go não disponível para SDK 55** → Mitigation: usar dev build (expo-dev-client). Documentado no CLAUDE.md.
- **[Risk] Fontes Poppins podem não carregar antes do splash** → Mitigation: usar `expo-font` + `SplashScreen.preventAutoHideAsync()` no root layout para aguardar carregamento das fontes antes de mostrar qualquer tela.
