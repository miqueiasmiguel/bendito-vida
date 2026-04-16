## 1. Store — Adicionar `updateName`

- [x] 1.1 Adicionar método `updateName(userId: string, name: string): Promise<void>` ao `useProfileStore` que chama `supabase.from('profiles').update({ name }).eq('id', userId)` e atualiza `profile.name` no estado local

## 2. Estrutura de Rotas

- [x] 2.1 Criar pasta `src/app/(tabs)/profile/` e mover o conteúdo de `profile.tsx` para `profile/index.tsx`
- [x] 2.2 Criar arquivo `src/app/(tabs)/profile/my-mixes.tsx` (stub inicial)
- [x] 2.3 Criar arquivo `src/app/(tabs)/profile/settings.tsx` (stub inicial)

## 3. Hub de Perfil (`profile/index.tsx`)

- [x] 3.1 Substituir `BioactiveSummary` pelo `BioactiveMap` (importar de `@/components/dashboard/BioactiveMap`) com `topNutrients`, `recommendedIngredients` e `onQuizPress`
- [x] 3.2 Remover a seção inline de "Meus Mixes" (lista de `SavedMixCard` e skeleton loaders)
- [x] 3.3 Remover a seção inline de "Configurações" (botão de logout)
- [x] 3.4 Adicionar dois cards de estatísticas lado a lado: total de mixes (`mixes.length`) e dias de uso (calculado de `user.createdAt`)
- [x] 3.5 Adicionar dois itens de navegação (row com ícone Lucide + chevron): "Meus Mixes" → `router.push('/(tabs)/profile/my-mixes')` e "Configurações" → `router.push('/(tabs)/profile/settings')`

## 4. Sub-tela "Meus Mixes" (`profile/my-mixes.tsx`)

- [x] 4.1 Implementar tela com header customizado (título "Meus Mixes" + `<ChevronLeft />` + `router.back()`)
- [x] 4.2 Renderizar lista com `FlatList` usando dados de `useProfileStore.mixes` e componente `SavedMixCard`
- [x] 4.3 Implementar skeleton loaders (3 cards) durante `isLoading`
- [x] 4.4 Implementar estado vazio com mensagem e botão "Criar meu Mix" → `/(tabs)/simulator`
- [x] 4.5 Implementar estado de erro com mensagem discreta

## 5. Sub-tela "Configurações" (`profile/settings.tsx`)

- [x] 5.1 Implementar tela com header customizado (título "Configurações" + `<ChevronLeft />` + `router.back()`)
- [x] 5.2 Adicionar campo de texto pré-preenchido com `user.name` para editar nome de exibição
- [x] 5.3 Validar que o campo não está vazio antes de chamar `updateName`; exibir mensagem inline se vazio
- [x] 5.4 Chamar `useProfileStore.updateName(user.id, name)` ao tocar "Salvar"; exibir feedback de sucesso ou erro
- [x] 5.5 Adicionar botão "Sair da conta" (variante secundária) que chama `signOut()` e redireciona para `/`

## 6. Limpeza

- [x] 6.1 Remover importação e uso de `BioactiveSummary` de qualquer tela (verificar se existem outras referências além do perfil)
- [x] 6.2 Deletar `src/components/profile/BioactiveSummary.tsx` se não houver outros consumidores
- [x] 6.3 Atualizar `src/components/profile/index.ts` para remover export de `BioactiveSummary` se deletado

## 7. Testes

- [x] 7.1 Atualizar ou criar teste unitário para `useProfileStore` cobrindo `updateName` (sucesso e erro)
- [x] 7.2 Criar teste de snapshot/render para o hub `profile/index.tsx`
- [x] 7.3 Criar teste de render para `profile/settings.tsx` cobrindo validação do campo de nome
