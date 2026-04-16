## ADDED Requirements

### Requirement: Menu contextual no card Mapa Bioativo
O card Mapa Bioativo SHALL exibir um botão de menu (ícone `MoreVertical`, três pontinhos verticais) no canto superior direito do cabeçalho do card, em ambos os estados (quiz concluído e quiz não concluído). Ao tocar no botão, SHALL ser exibido um menu modal com a opção "Refazer quiz". Ao selecionar "Refazer quiz", o app SHALL navegar para `/(onboarding)/quiz`. O menu SHALL ser fechável tocando fora ou em "Cancelar".

#### Scenario: Abrir menu no estado preenchido
- **WHEN** o usuário toca nos três pontinhos no card Mapa Bioativo com perfil já preenchido
- **THEN** um modal é exibido com a opção "Refazer quiz" e um botão "Cancelar"

#### Scenario: Abrir menu no estado vazio
- **WHEN** o usuário toca nos três pontinhos no card Mapa Bioativo sem quiz concluído
- **THEN** um modal é exibido com a opção "Refazer quiz" e um botão "Cancelar"

#### Scenario: Selecionar "Refazer quiz"
- **WHEN** o usuário toca em "Refazer quiz" no menu contextual
- **THEN** o modal é fechado e o app navega para a tela do quiz `/(onboarding)/quiz`

#### Scenario: Fechar menu sem ação
- **WHEN** o usuário toca em "Cancelar" ou no overlay escuro fora do menu
- **THEN** o modal é fechado sem nenhuma navegação ou alteração de estado
