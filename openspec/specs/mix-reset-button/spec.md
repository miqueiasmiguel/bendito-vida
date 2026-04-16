### Requirement: Botão "Limpar Mix" na tela do simulador
A tela do simulador SHALL exibir um botão secundário com label **"Limpar Mix"** acima do botão primário "Gerar Minha Receita", visível apenas quando `hasItems === true` (ao menos 1 ingrediente com `grams > 0` no mix). O botão SHALL usar `variant="secondary"` (borda `primary[700]`, fundo transparente, texto `primary[700]`). Ao pressionar, SHALL chamar `resetMix()` do `useSimulatorStore`, zerando todos os ingredientes do mix sem confirmação adicional.

#### Scenario: Mix vazio — botão oculto
- **WHEN** nenhum ingrediente foi adicionado ao mix (`hasItems === false`)
- **THEN** o botão "Limpar Mix" não é renderizado na tela

#### Scenario: Mix com ingredientes — botão visível
- **WHEN** ao menos 1 ingrediente tem `grams > 0` no mix
- **THEN** o botão "Limpar Mix" aparece acima do botão "Gerar Minha Receita"

#### Scenario: Toque em "Limpar Mix"
- **WHEN** o usuário pressiona o botão "Limpar Mix"
- **THEN** todos os ingredientes são removidos do mix (`mixItems` fica vazio), o jarro volta ao estado vazio, o subtítulo volta a "Toque nos ingredientes para montar seu mix", e o botão "Limpar Mix" desaparece

### Requirement: Action resetMix no useSimulatorStore
O `useSimulatorStore` SHALL expor uma action `resetMix()` que define `mixItems` como `{}`, zerando todo o mix. A action SHALL ser tipada e testada.

#### Scenario: resetMix zera o mix
- **WHEN** `resetMix()` é chamado com ingredientes no mix
- **THEN** `mixItems` se torna `{}` e `Object.values(mixItems).length === 0`

#### Scenario: resetMix em mix vazio é idempotente
- **WHEN** `resetMix()` é chamado sem ingredientes no mix
- **THEN** `mixItems` permanece `{}` sem erros
