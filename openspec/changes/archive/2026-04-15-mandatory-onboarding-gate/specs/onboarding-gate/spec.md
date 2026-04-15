## ADDED Requirements

### Requirement: Gate de onboarding bloqueia acesso às tabs para primeiro uso
O root layout SHALL verificar, após resolver a sessão do usuário autenticado, se o campo `onboarding_completed` é `true` no perfil Supabase. Caso seja `false` ou `null`, o app SHALL redirecionar para `/(onboarding)/quiz` via `router.replace`, impedindo acesso às rotas de tabs e home.

#### Scenario: Usuário autenticado sem onboarding concluído abre o app
- **WHEN** o app inicializa e a sessão Supabase resolve para um usuário autenticado com `onboarding_completed = false`
- **THEN** o root layout executa `router.replace('/(onboarding)/quiz')` antes de renderizar qualquer rota de tab

#### Scenario: Usuário autenticado com onboarding concluído abre o app
- **WHEN** o app inicializa e a sessão Supabase resolve para um usuário autenticado com `onboarding_completed = true`
- **THEN** o root layout não redireciona e o Expo Router renderiza a rota padrão (index ou tabs)

#### Scenario: Usuário não autenticado não é afetado pelo gate
- **WHEN** o app inicializa sem sessão ativa (usuário não logado)
- **THEN** o gate não executa redirecionamento e o Welcome screen é renderizado normalmente

#### Scenario: Splash screen mantida durante resolução do gate
- **WHEN** o app inicializa e ainda está aguardando a resolução da sessão e da flag de onboarding
- **THEN** o splash screen permanece visível (sem flash de rota) até a decisão de redirect estar tomada

#### Scenario: Flag nula tratada como não concluído
- **WHEN** o perfil do usuário existe no Supabase mas `onboarding_completed` é `null` (conta antiga sem a coluna)
- **THEN** o gate trata como `false` e redireciona para o quiz

---

### Requirement: Flag de onboarding é persistida no Supabase ao concluir o quiz
Ao concluir o quiz de triagem, o sistema SHALL gravar `onboarding_completed = true` na tabela `profiles` do Supabase para o usuário autenticado atual. A operação SHALL ocorrer antes da navegação para `/(tabs)/home`.

#### Scenario: Gravação bem-sucedida da flag
- **WHEN** o usuário toca "Concluir" na última pergunta do quiz e a operação Supabase é bem-sucedida
- **THEN** `profiles.onboarding_completed` é `true` para aquele `user_id` e o store local reflete `onboardingCompleted: true`

#### Scenario: Erro ao gravar flag não impede navegação
- **WHEN** o usuário toca "Concluir" e a operação Supabase falha (ex: offline)
- **THEN** o app navega para `/(tabs)/home` mesmo assim; na próxima abertura o gate redirecionará novamente para o quiz (comportamento idempotente aceitável no MVP)

---

### Requirement: useAuthStore expõe estado de onboarding e ação de conclusão
O `useAuthStore` SHALL incluir os campos `onboardingCompleted: boolean` (default `false`) e `onboardingChecked: boolean` (default `false`), e a ação assíncrona `markOnboardingComplete()`. O callback de `onAuthStateChange` SHALL ser síncrono: seta `sessionChecked: true` imediatamente ao receber a sessão, depois dispara o fetch de `profiles.onboarding_completed` como promise detached (`.then().catch()`), que seta `onboardingChecked: true` ao terminar — com ou sem erro. Usuários sem sessão recebem `onboardingChecked: true` diretamente.

#### Scenario: Estado carregado na inicialização com sessão ativa
- **WHEN** `onAuthStateChange` recebe uma sessão válida
- **THEN** `sessionChecked` é setado para `true` imediatamente; após o fetch de perfil concluir (sucesso ou erro), `onboardingCompleted` reflete `profiles.onboarding_completed` e `onboardingChecked` é setado para `true`

#### Scenario: Fetch de perfil falha na inicialização
- **WHEN** o fetch de `profiles` retorna erro (rede, RLS, linha inexistente)
- **THEN** `onboardingCompleted` é tratado como `false` e `onboardingChecked` é setado para `true` mesmo assim, desbloqueando o splash screen

#### Scenario: markOnboardingComplete atualiza store e Supabase
- **WHEN** `markOnboardingComplete()` é chamado
- **THEN** `onboardingCompleted` passa a ser `true` no store E o Supabase é atualizado via `upsert` em `profiles`
