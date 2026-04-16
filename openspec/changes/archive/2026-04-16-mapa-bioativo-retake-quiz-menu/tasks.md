## 1. Componente BioactiveMap

- [x] 1.1 Adicionar prop `onRetakeQuiz?: () => void` à interface `BioactiveMapProps`
- [x] 1.2 Adicionar state `menuVisible: boolean` com `useState`
- [x] 1.3 Reestruturar o header do card como uma row (`flexDirection: 'row'`, `justifyContent: 'space-between'`, `alignItems: 'center'`) contendo o título e um `TouchableOpacity` com ícone `MoreVertical` (Lucide, size=20, strokeWidth=1.5)
- [x] 1.4 Garantir que a touch area do botão de menu seja ≥ 44×44 via `padding: spacing.sm`
- [x] 1.5 Implementar `Modal` com `transparent` e `animationType="fade"`: overlay semitransparente + card inferior com botões "Refazer quiz" e "Cancelar"
- [x] 1.6 Aplicar estilos do design system ao modal (cores de token, tipografia Poppins, radii, spacing)
- [x] 1.7 Ao tocar "Refazer quiz": fechar modal e chamar `onRetakeQuiz`
- [x] 1.8 Ao tocar "Cancelar" ou overlay: fechar modal sem ação
- [x] 1.9 Adicionar `accessibilityLabel="Opções do Mapa Bioativo"` e `accessibilityRole="button"` no botão de três pontinhos

## 2. Integração na Home

- [x] 2.1 Em `src/app/(tabs)/home.tsx`, passar `onRetakeQuiz={() => router.push('/(onboarding)/quiz')}` ao componente `BioactiveMap`

## 3. Testes

- [x] 3.1 Atualizar (ou criar) teste unitário de `BioactiveMap` para verificar que o botão de três pontinhos é renderizado
- [x] 3.2 Adicionar cenário de teste: tocar no botão abre o modal com as opções "Refazer quiz" e "Cancelar"
- [x] 3.3 Adicionar cenário de teste: tocar em "Refazer quiz" chama `onRetakeQuiz`
- [x] 3.4 Adicionar cenário de teste: tocar em "Cancelar" fecha o modal sem chamar `onRetakeQuiz`
