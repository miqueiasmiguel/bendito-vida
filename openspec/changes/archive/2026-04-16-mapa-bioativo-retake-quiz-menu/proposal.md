## Why

O card "Mapa Bioativo" na Home não oferece uma forma clara de refazer o quiz após a primeira conclusão, obrigando o usuário a navegar manualmente — o que reduz a usabilidade especialmente para o público-alvo (idosos, baixa literacia digital). Um menu de contexto discreto (três pontinhos) no canto do card é o padrão mobile para ações secundárias não destrutivas.

## What Changes

- Adicionar ícone `MoreVertical` (três pontinhos) no canto superior direito do card `BioactiveMap`, visível tanto no estado preenchido quanto no estado vazio
- Ao tocar nos três pontinhos, exibir um menu contextual com a opção **"Refazer quiz"**
- "Refazer quiz" navega para `/(onboarding)/quiz` (mesma rota já usada pelo botão "Fazer Quiz" no estado vazio)
- O menu é um `Modal` ou `ActionSheet` nativo leve — sem bibliotecas externas

## Capabilities

### New Capabilities

_Nenhuma nova capability independente — a mudança é um refinamento do card Mapa Bioativo._

### Modified Capabilities

- `home-screen`: Adicionar requisito de menu contextual no card Mapa Bioativo, disponível em ambos os estados (preenchido e vazio), com ação "Refazer quiz"

## Impact

- `src/components/dashboard/BioactiveMap.tsx` — adicionar botão de menu e lógica de exibição do menu
- `openspec/specs/home-screen/spec.md` — delta com o novo requisito
- Nenhuma mudança em stores, roteamento ou dados
