## Context

A tela `result.tsx` foi projetada para exibir o resultado de um mix recém-criado, lendo dados do `useSimulatorStore` (estado efêmero). Mixes salvos vivem no Supabase e são expostos pelo `useProfileStore` como `Mix[]`. A tela "Meus Mixes" (`my-mixes.tsx`) lista esses mixes mas não oferece forma de visualizar um mix individual.

O segundo problema é de navegação: o `_layout.tsx` da tab Profile usa `<Stack>` sem nenhum listener de `tabPress`. O Expo Router, por padrão, preserva o estado da stack ao trocar de tab, de modo que a stack permanece em `my-mixes` quando o usuário retorna via tab bar.

## Goals / Non-Goals

**Goals:**
- Permitir ao usuário ver os detalhes nutricionais e o cartão compartilhável de qualquer mix salvo.
- Reutilizar os componentes existentes (`NutrientBar`, `RecipeCard`) sem duplicação de lógica.
- Fazer o botão da tab Profile sempre levar ao hub `/(tabs)/profile`.

**Non-Goals:**
- Editar ou reeditar o mix salvo no simulador.
- Deletar um mix a partir da tela de detalhe.
- Paginação ou lazy loading dos mixes (escopo de `my-mixes`).

## Decisions

### 1. Nova rota em vez de reutilizar `result.tsx` diretamente

**Decisão:** Criar `src/app/(tabs)/profile/mix-detail.tsx` em vez de modificar `result.tsx`.

**Rationale:** `result.tsx` depende do `useSimulatorStore` (estado efêmero do mix em criação) e inclui lógica de salvar no Supabase. Para mixes já salvos a fonte de dados é o `useProfileStore`. Misturar as duas fontes em `result.tsx` adicionaria complexidade condicional e acoplamento indesejado. Uma rota dedicada é mais simples e mantém separação de contextos.

**Alternativa considerada:** Passar `mixId` como query param para `result.tsx` e fazer a tela escolher entre store e Supabase. Rejeitado por poluir `result.tsx` com responsabilidade dupla.

### 2. Passagem do mixId via query param de rota

**Decisão:** Navegar para `/(tabs)/profile/mix-detail?mixId=<id>` e ler via `useLocalSearchParams` dentro da tela.

**Rationale:** O mix já está carregado no `useProfileStore.mixes` (fetched em `my-mixes.tsx`). Basta localizar `mixes.find(m => m.id === mixId)`. Evita serialização de objeto inteiro na URL.

**Alternativa considerada:** Armazenar o mix selecionado num campo `selectedMix` do `useProfileStore`. Rejeitado por acrescentar estado desnecessário ao store.

### 3. Reset da stack ao pressionar a tab Profile

**Decisão:** No `_layout.tsx` do grupo Profile, usar `<Tabs.Screen>` com `listeners={{ tabPress: () => router.replace('/(tabs)/profile') }}`.

**Rationale:** O Expo Router expõe `listeners` como prop de `<Tabs.Screen>` — é a forma canônica de interceptar `tabPress` e redirecionar sem afetar o restante da navegação. `router.replace` substitui a entrada atual da stack de tabs sem empilhar.

**Alternativa considerada:** Usar `useFocusEffect` no `profile/index.tsx` para resetar a stack quando a tela ganhar foco. Rejeitado porque `useFocusEffect` dispara também ao voltar de sub-telas internas (ex: voltar de `my-mixes`), causando loop de navegação.

## Risks / Trade-offs

- **Mix não encontrado no store:** Se o usuário navegar diretamente para `mix-detail?mixId=xxx` sem ter carregado o store (cold start), `mixes.find` retorna `undefined`. → Mitigação: exibir estado de loading enquanto `isLoading` e mensagem de erro "Mix não encontrado" se `!mix && !isLoading`, com botão de volta.
- **`router.replace` na tabPress pode interferir com deep links:** Em cenários de deep link direto para `/(tabs)/profile/my-mixes`, o listener de tabPress não é acionado (só ocorre ao tocar a tab bar), portanto o impacto é nulo.
