## ADDED Requirements

### Requirement: Perfil bioativo reidratado do Supabase na inicialização
Ao inicializar o app com um usuário autenticado que já completou o quiz, o sistema SHALL recuperar `bioactive_profile` da tabela `profiles` e popular `useQuizStore.nutritionProfile` **antes** de renderizar a tela Home. Se `bioactive_profile` for `null` (usuário nunca completou o quiz ou fez quiz antes desta feature), o Mapa Bioativo SHALL exibir o estado vazio ("Complete o quiz para ver seu Mapa Bioativo").

#### Scenario: App reinicia com usuário que completou o quiz
- **WHEN** o usuário fecha e reabre o app estando autenticado e `profiles.bioactive_profile` é não-nulo
- **THEN** a tela Home exibe o Mapa Bioativo com os nutrientes e ingredientes do perfil salvo, sem precisar refazer o quiz

#### Scenario: App reinicia com usuário sem perfil salvo
- **WHEN** o usuário fecha e reabre o app estando autenticado e `profiles.bioactive_profile` é `null`
- **THEN** a tela Home exibe o estado vazio do Mapa Bioativo com botão "Fazer Quiz"
