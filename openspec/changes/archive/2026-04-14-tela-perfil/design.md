## Context

O app já possui autenticação (Supabase), quiz de triagem (`useQuizStore`), simulador com mixes (`useSimulatorStore`) e dashboard de evolução. A tela de Perfil fecha o fluxo do MVP exibindo a identidade do usuário, o perfil bioativo gerado no quiz, os mixes salvos no Supabase e opções de configuração.

Estado atual: a rota `/(tabs)/profile` existe no layout de tabs mas não tem implementação — retorna tela vazia.

## Goals / Non-Goals

**Goals:**
- Exibir avatar (inicial do nome), nome e data de cadastro
- Mostrar resumo do Mapa Bioativo (3 nutrientes prioritários do `bioactive_profile` da tabela `profiles`)
- Listar mixes salvos (tabela `mixes` no Supabase, ordenados por `created_at` desc)
- Permitir logout (via `useAuthStore.signOut`)
- Seção de configurações mínima (apenas Logout para MVP)
- Componentes reutilizáveis: `SavedMixCard`, `BioactiveSummary`

**Non-Goals:**
- Edição de perfil / upload de foto real (avatar = inicial do nome)
- Notificações ou preferências avançadas
- Exclusão de conta
- Paginação de mixes (MVP mostra últimos 10)

## Decisions

### 1. Store dedicado: `useProfileStore`
**Decisão:** Criar `useProfileStore` para encapsular fetch de `profiles` + `mixes` do Supabase, estado de carregamento e erro.

**Alternativa considerada:** Fazer fetch direto no componente via `useEffect`. Rejeitado porque duplicaria lógica já padrão no projeto (todas as telas usam stores Zustand) e dificultaria testes unitários.

### 2. Avatar como inicial do nome
**Decisão:** Renderizar um `View` circular com a inicial do nome em `primary-700`, sem upload de imagem.

**Alternativa considerada:** `expo-image-picker` para foto real. Rejeitado — fora do escopo MVP; adicionaria permissões e complexidade de storage desnecessários para o edital.

### 3. Mixes exibidos como lista vertical com `FlatList`
**Decisão:** `FlatList` com `keyExtractor` mostrando `SavedMixCard` (nome do mix, data, lista de ingredientes resumida, sumário nutricional).

**Alternativa considerada:** `ScrollView` simples. Rejeitado — `FlatList` é padrão do projeto e performa melhor com listas variáveis.

### 4. Dados do Mapa Bioativo via `useQuizStore`
**Decisão:** Ler `bioactiveProfile` do `useQuizStore` (já populado pelo quiz) e exibir as 3 tags prioritárias com ícone Lucide e barra de porcentagem simplificada.

**Alternativa considerada:** Fazer novo fetch de `profiles.bioactive_profile` do Supabase. Desnecessário se o store já tem os dados; o `useProfileStore` sincroniza na montagem caso o store esteja vazio.

## Risks / Trade-offs

- **Mixes podem não existir** → Exibir estado vazio "Você ainda não salvou nenhum mix. Crie o seu!" com CTA para o Simulador. Mitigation: estado `hasMixes` no store.
- **Quiz não completado** → `bioactiveProfile` pode ser `null`. Mitigation: exibir mensagem "Complete o quiz para ver seu Mapa Bioativo" com botão de navegação.
- **Latência do Supabase** → Skeleton loader nos cards de mixes enquanto `isLoading === true`.
- **Token expirado no logout** → `signOut()` do Supabase limpa sessão localmente mesmo sem rede; redirecionar para `/(auth)/login` usando `router.replace`.
