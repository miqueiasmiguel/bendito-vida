## 1. Store e tipos

- [x] 1.1 Criar interface `ProfileState` e `SavedMix` em `src/types/profile.ts`
- [x] 1.2 Criar `src/stores/useProfileStore.ts` com `fetchProfile(userId)`, `profile`, `mixes`, `isLoading`, `error`
- [x] 1.3 Escrever teste unitário para `useProfileStore` (fetch sucesso e fetch erro com mock do Supabase)

## 2. Componentes de domínio

- [x] 2.1 Criar `src/components/profile/BioactiveSummary.tsx` — card com 3 nutrientes prioritários (ícone Lucide, nome, barra de intensidade) + estado vazio com CTA para quiz
- [x] 2.2 Criar `src/components/profile/SavedMixCard.tsx` — card com nome do mix, data, ingredientes resumidos (máx. 3 + "+N") e sumário nutricional (calorias + proteínas)
- [x] 2.3 Escrever teste unitário para `BioactiveSummary` (com perfil e sem perfil)
- [x] 2.4 Escrever teste unitário para `SavedMixCard`
- [x] 2.5 Exportar novos componentes em `src/components/profile/index.ts`

## 3. Tela de Perfil

- [x] 3.1 Criar `src/app/(tabs)/profile.tsx` com `ScrollView` e seções: Header (avatar + nome + data), Mapa Bioativo, Mixes Salvos, Configurações
- [x] 3.2 Implementar avatar circular com inicial do nome (fundo `primary-700`, texto branco H2)
- [x] 3.3 Integrar `BioactiveSummary` lendo `useQuizStore().bioactiveProfile`
- [x] 3.4 Integrar `FlatList` de mixes com `SavedMixCard`, skeleton loaders durante `isLoading` e estado vazio
- [x] 3.5 Implementar seção Configurações com botão "Sair da conta" (botão secundário) + `router.replace('/(auth)/login')` após `signOut()`
- [x] 3.6 Chamar `useProfileStore.fetchProfile(user.id)` no `useEffect` ao montar a tela

## 4. Polimento e validação

- [x] 4.1 Verificar que `/(tabs)/profile` aparece corretamente na tab bar com ícone `User` (já configurado no layout)
- [x] 4.2 Testar fluxo completo: quiz → simulador → salvar mix → perfil exibe mix salvo
- [x] 4.3 Testar logout: sessão limpa, redirecionamento para login, não consegue voltar para tabs sem autenticar
- [x] 4.4 Verificar acessibilidade: `accessibilityLabel` em avatar, botão de logout e cards de mix
- [x] 4.5 Rodar `npm run validate` e garantir zero warnings/erros de lint e TypeScript
