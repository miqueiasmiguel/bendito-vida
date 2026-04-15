## Context

O app usa Expo Router com root layout em `src/app/_layout.tsx`. A autenticação é gerenciada pelo `useAuthStore` via Supabase. Atualmente, o root layout apenas carrega fontes e renderiza um `<Stack>` sem nenhuma lógica de guarda de rota.

O quiz de triagem (`/(onboarding)/quiz`) coleta o perfil nutricional do usuário, mas sua conclusão não é persistida — ao reiniciar o app, o estado é perdido e o usuário pode pular o quiz acessando diretamente as tabs.

A flag de onboarding precisa ser persistida de forma associada à conta do usuário (Supabase), não apenas localmente, para garantir que reinstalações não forcem um re-onboarding desnecessário.

## Goals / Non-Goals

**Goals:**
- Usuário autenticado que nunca completou o onboarding é redirecionado para `/(onboarding)/quiz` ao entrar no app.
- Após completar o quiz, a flag `onboarding_completed = true` é gravada no Supabase e o usuário acessa as tabs livremente.
- Em acessos futuros (mesmo após reinstalação), a flag é consultada e o gate não bloqueia.
- Usuários não autenticados não são afetados — Welcome e auth continuam acessíveis.

**Non-Goals:**
- Não implementar onboarding progressivo ou multi-etapas além do quiz já existente.
- Não bloquear rotas individuais (o gate é global, no root layout).
- Não resetar o onboarding via UI de perfil (pode ser futuro).

## Decisions

### D1: Onde verificar o gate — root layout vs. middleware de rota

**Decisão:** Root layout (`_layout.tsx`), usando `useEffect` + `router.replace`.

**Alternativas consideradas:**
- *Expo Router middleware:* Não existe API oficial de middleware no Expo Router que execute antes da renderização de qualquer rota. O padrão da comunidade é `useEffect` no root layout.
- *Gate por rota:* Verificar em cada tela individualmente é propenso a esquecimentos e duplicação.

**Rationale:** O root layout é o único ponto que envolve toda a árvore de navegação. `router.replace` garante que o usuário não possa voltar para a rota anterior com o botão de voltar.

---

### D2: Onde persistir a flag — Supabase vs. AsyncStorage

**Decisão:** Supabase, na tabela `profiles` (`onboarding_completed boolean default false`).

**Alternativas consideradas:**
- *AsyncStorage apenas:* Simples, mas perdido em reinstalações. Cria re-onboarding desnecessário e desvincula o estado do usuário da conta.
- *Ambos (cache local + Supabase):* Complexidade extra desnecessária no MVP.

**Rationale:** A flag está associada à identidade do usuário, não ao dispositivo. Supabase é o backend de verdade do app; manter tudo lá é consistente com a arquitetura existente.

---

### D3: Onde ler a flag — `useAuthStore` vs. store separado

**Decisão:** Estender `useAuthStore` com o campo `onboardingCompleted: boolean` e a ação `markOnboardingComplete()`.

**Alternativas consideradas:**
- *Store separado `useOnboardingStore`:* Mais granular, mas cria dependência entre stores (precisa do userId do authStore).
- *Consulta direta no layout:* Sem store, o layout faria fetch direto. Dificulta testes e reuso.

**Rationale:** O onboarding completion é parte do estado do usuário autenticado — faz sentido coexistir com `useAuthStore`. A ação `markOnboardingComplete` encapsula a gravação no Supabase e a atualização do estado local.

---

### D4: Lógica de loading — evitar flash de rota errada e tela preta

**Decisão:** O `useAuthStore` usa **dois flags separados**: `sessionChecked` (auth resolvido) e `onboardingChecked` (fetch de perfil concluído). O root layout só esconde o splash quando ambos estão prontos para o usuário logado: `appReady = fonts && sessionChecked && (user === null || onboardingChecked)`.

O callback de `onAuthStateChange` é **síncrono** — `sessionChecked` é setado imediatamente ao receber a sessão. O fetch de `profiles.onboarding_completed` é disparado como promise encadeada (`.then().catch()` detached), e seta `onboardingChecked: true` ao terminar (com ou sem erro). Usuários sem sessão ativa recebem `onboardingChecked: true` diretamente, sem fetch.

**Alternativa rejeitada — callback assíncrono:** Usar `async/await` diretamente no callback do `onAuthStateChange` fazia `sessionChecked` depender do retorno do fetch de perfil. Se a request travasse ou falhasse silenciosamente, `sessionChecked` nunca era setado e o layout retornava `null` para sempre (tela preta).

**Rationale:** Separar os dois flags garante que: (a) o splash não fica preso por falha de rede no fetch de perfil; (b) o gate de onboarding só executa quando o valor real de `onboarding_completed` foi lido, evitando redirect incorreto para o quiz.

## Risks / Trade-offs

- **[Risco] Race condition entre auth e consulta de flag** → O gate só executa após `session` e `onboardingCompleted` estarem resolvidos. O `useAuthStore` já faz `supabase.auth.getSession()` no boot; a leitura da flag será encadeada nesse mesmo momento.

- **[Risco] Usuário autenticado sem registro em `profiles`** (ex: conta criada antes da coluna existir) → A query retorna `null`; tratar como `onboarding_completed = false` e redirecionar para o quiz.

- **[Trade-off] Supabase offline no boot** → Se o Supabase estiver indisponível, a flag não é lida. Decisão: bloquear o acesso às tabs e exibir o quiz novamente. Aceitável no MVP; onboarding é idempotente.

## Migration Plan

1. Adicionar coluna `onboarding_completed boolean default false` na tabela `profiles` do Supabase (migration SQL).
2. Usuários existentes com a coluna `null` são tratados como `false` — receberão o quiz na próxima abertura.
3. Deploy do código novo: o gate só ativa para usuários autenticados, então o fluxo de Welcome/Auth não é afetado.
4. Rollback: remover a lógica de redirect do `_layout.tsx` — sem downtime de schema necessário.

## Open Questions

- A tabela `profiles` já existe no Supabase com RLS configurado? (Assumido sim, baseado na arquitetura existente.)
- O quiz deve ser re-exibido se o usuário fechar o app no meio do onboarding? (Sim — a flag só é gravada ao concluir todas as 5 perguntas.)
