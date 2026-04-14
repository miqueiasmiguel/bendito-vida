## MODIFIED Requirements

### Requirement: Mapa Bioativo com nutrientes prioritários
A tela Home SHALL exibir um card "Mapa Bioativo" contendo até 6 nutrientes prioritários derivados do `nutritionProfile` do quiz, visualizados como um **gráfico radar (teia de aranha)** via componente `BioactiveRadarChart`. Se o `nutritionProfile` retornar mais de 6 nutrientes, os 6 com maior score SHALL ser selecionados. Os valores de cada nutriente SHALL ser normalizados (0–100) com base no valor máximo do respectivo grupo.

#### Scenario: Quiz concluído com perfil gerado (3 a 6 nutrientes)
- **WHEN** `useQuizStore.nutritionProfile` contém entre 3 e 6 tags acumuladas
- **THEN** o card exibe o `BioactiveRadarChart` com um eixo por nutriente, área preenchida em `primary-500` (30% opacidade) e labels com nome curto de cada nutriente

#### Scenario: Quiz concluído com mais de 6 nutrientes
- **WHEN** `useQuizStore.nutritionProfile` contém mais de 6 nutrientes
- **THEN** o card exibe o `BioactiveRadarChart` com os 6 nutrientes de maior score, ignorando os demais

#### Scenario: Quiz não concluído
- **WHEN** `useQuizStore.nutritionProfile` está vazio ou nulo
- **THEN** o card exibe estado vazio com mensagem "Complete o quiz para ver seu Mapa Bioativo" e botão "Fazer Quiz"
