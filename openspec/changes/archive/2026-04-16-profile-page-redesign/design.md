## Context

A tela `/(tabs)/profile.tsx` atual é uma ScrollView monolítica que acumula três responsabilidades distintas: identidade do usuário, visualização do mapa bioativo, lista de mixes e ações de configuração. O componente `BioactiveSummary` exibe apenas 3 nutrientes com barras simples, enquanto o Home já possui o `BioactiveMap` com radar chart completo — duplicação de visualização com qualidade inferior no perfil.

O Expo Router (SDK 55, file-based) suporta rotas aninhadas dentro de tabs via pastas — `(tabs)/profile/` com sub-arquivos cria rotas `/(tabs)/profile/my-mixes` e `/(tabs)/profile/settings` sem precisar de Stack adicional.

## Goals / Non-Goals

**Goals:**
- Transformar `/(tabs)/profile` em hub de navegação limpo com acesso rápido às sub-telas
- Substituir `BioactiveSummary` pelo `BioactiveMap` (radar chart) já existente no Home
- Extrair listagem de mixes para `/(tabs)/profile/my-mixes`
- Extrair configurações (editar nome + logout) para `/(tabs)/profile/settings`
- Adicionar `updateName()` ao `useProfileStore` para persistir nome no Supabase
- Exibir 2 stats cards simples (total de mixes, dias de uso)

**Non-Goals:**
- Upload de foto de perfil (fora do escopo MVP)
- Notificações ou preferências avançadas
- Paginação real dos mixes (a lista atual com limite 10 é suficiente para MVP)
- Deletar mixes na sub-tela (operação destrutiva, adiar)

## Decisions

### D1 — Roteamento das sub-telas via Expo Router aninhado

**Escolhido:** Criar pasta `src/app/(tabs)/profile/` com `index.tsx` (hub), `my-mixes.tsx` e `settings.tsx`. O layout da tab continua sendo o `(tabs)/_layout.tsx` existente; não é necessário um `_layout.tsx` dentro de `profile/`.

**Alternativa descartada:** Stack Navigator explícito (`profile/_layout.tsx` com `<Stack />`). Adiciona complexidade desnecessária; o header padrão do Expo Router já fornece botão de voltar.

**Razão:** Menor fricção, zero config extra, consistente com o padrão file-based já usado no projeto.

---

### D2 — Reutilizar `BioactiveMap` sem modificação

**Escolhido:** Importar `BioactiveMap` de `@/components/dashboard/BioactiveMap` direto no `profile/index.tsx` com as mesmas props que o Home usa.

**Alternativa descartada:** Criar um wrapper `ProfileBioactiveMap`. Seria overengineering; o componente já aceita as props necessárias.

---

### D3 — `updateName` no `useProfileStore`

**Escolhido:** Adicionar `updateName(userId: string, name: string): Promise<void>` ao store, que executa `supabase.from('profiles').update({ name }).eq('id', userId)` e atualiza o estado local em caso de sucesso.

**Razão:** Mantém o padrão de centralizar acesso ao Supabase nos stores Zustand. A tela de settings apenas chama `updateName` e exibe feedback.

---

### D4 — Stats cards calculados localmente

**Escolhido:** Total de mixes = `mixes.length` do store. Dias de uso = `Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86_400_000)`.

**Razão:** Zero queries extras, dados já disponíveis em memória.

## Risks / Trade-offs

- **[Risco] `BioactiveMap` no perfil duplica o radar chart que já está no Home** → Aceitável; o usuário acessa as abas por contexto diferente. Mitigation: No futuro, pode-se adicionar prop `compact` ao BioactiveMap para variar densidade.
- **[Risco] Renomear `profile.tsx` para `profile/index.tsx` pode quebrar referências de rota** → Expo Router trata `/profile` e `/profile/index` como equivalentes. Testar navegação após refatoração.
- **[Risco] `BioactiveSummary` removido do perfil fica orphan** → Deletar o arquivo junto com a task de cleanup para não acumular código morto.
