## 1. Fix Profile Tab Reset

- [x] 1.1 Em `src/app/(tabs)/_layout.tsx`, adicionar `listeners` à `<Tabs.Screen name="profile">` para ouvir `tabPress` e chamar `router.replace('/(tabs)/profile')`

## 2. SavedMixCard — suporte a onPress

- [x] 2.1 Em `src/components/profile/SavedMixCard.tsx`, adicionar prop `onPress?: () => void` à interface e envolver o card em `TouchableOpacity` (ou `Pressable`) com `onPress`
- [x] 2.2 Em `src/app/(tabs)/profile/my-mixes.tsx`, passar `onPress={() => router.push('/(tabs)/profile/mix-detail?mixId=' + item.id)}` para cada `SavedMixCard` no `renderItem`

## 3. Nova tela Mix Detail

- [x] 3.1 Criar `src/app/(tabs)/profile/mix-detail.tsx` com header ("← Voltar" + "Detalhe do Mix"), lendo `mixId` via `useLocalSearchParams`
- [x] 3.2 Implementar lógica de hidratação: se `mixes.length === 0 && !isLoading && user?.id`, chamar `fetchProfile(user.id)` via `useEffect`
- [x] 3.3 Implementar estados de loading (`ActivityIndicator`) e mix não encontrado (mensagem + botão Voltar)
- [x] 3.4 Renderizar `NutrientBar` para Fibras, Proteínas, Ômega-3 e Calorias usando `mix.nutrition` diretamente
- [x] 3.5 Renderizar `RecipeCard` dentro de `ViewShot` com o nome e ingredientes do mix
- [x] 3.6 Implementar botão "Compartilhar" usando `expo-sharing` + `ViewShot.capture()`, com `Alert` de fallback quando indisponível
