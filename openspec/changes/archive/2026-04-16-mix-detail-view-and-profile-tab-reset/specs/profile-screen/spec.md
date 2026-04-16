## MODIFIED Requirements

### Requirement: Navegação para sub-telas a partir do Perfil
A tela de Perfil SHALL exibir dois itens de navegação em forma de cards/rows: "Meus Mixes" (navega para `/(tabs)/profile/my-mixes`) e "Configurações" (navega para `/(tabs)/profile/settings`). Cada item SHALL ter ícone Lucide à esquerda e chevron à direita. O layout da aba Profile (`_layout.tsx`) SHALL escutar o evento `tabPress` da tab bar e executar `router.replace('/(tabs)/profile')`, garantindo que pressionar a aba Profile sempre retorne ao hub de Perfil independentemente da sub-tela atual na stack.

#### Scenario: Toque em "Meus Mixes"
- **WHEN** o usuário toca o item "Meus Mixes"
- **THEN** o sistema navega para `/(tabs)/profile/my-mixes`

#### Scenario: Toque em "Configurações"
- **WHEN** o usuário toca o item "Configurações"
- **THEN** o sistema navega para `/(tabs)/profile/settings`

#### Scenario: Toque na tab Profile com sub-tela ativa
- **WHEN** o usuário está em `/(tabs)/profile/my-mixes` (ou qualquer sub-tela) e toca na aba "Perfil" da tab bar
- **THEN** o sistema navega para `/(tabs)/profile` (hub principal de Perfil), descartando a sub-tela da stack
