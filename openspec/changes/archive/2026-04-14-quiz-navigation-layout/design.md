## Context

O quiz de onboarding (`src/app/(onboarding)/quiz.tsx`) atualmente exibe apenas o botão "Próximo" na área de ação inferior, sem botão "Voltar". A barra de progresso está alinhada à esquerda. O público-alvo inclui idosos e pessoas com baixa literacia digital, o que exige navegação clara e previsível.

## Goals / Non-Goals

**Goals:**
- Exibir botão "Voltar" ao lado do botão "Próximo" em uma linha horizontal
- Ocultar o botão "Voltar" na pergunta 1 (sem destino anterior)
- Centralizar horizontalmente a barra de progresso na tela

**Non-Goals:**
- Alterar a lógica de transição entre perguntas (sliding horizontal)
- Modificar o cálculo de perfil nutricional
- Adicionar animações novas além das já existentes

## Decisions

**Layout dos botões — `flexDirection: 'row'` com `justifyContent: 'space-between'`**
Os botões "Voltar" e "Próximo" ficam em um container de linha com `gap` definido pelo design system (`spacing.md = 16`). O "Voltar" ocupa o lado esquerdo como botão secundário (border `primary-700`) e o "Próximo" o lado direito como botão primário (bg `accent-500`).

Alternativa considerada: manter "Próximo" em largura total e adicionar ícone de seta para voltar. Descartado por reduzir área de toque e clareza textual para o público-alvo.

**Visibilidade do botão "Voltar" — renderização condicional vs. opacidade**
Usar renderização condicional (`{currentStep > 1 && <Button>}`) em vez de `opacity: 0`. Evita que o leitor de tela anuncie um botão inativo.

**Centralização da barra de progresso — `alignSelf: 'center'` no container**
A barra de progresso será envolvida em um `View` com `alignItems: 'center'`, garantindo centralização independente do padding lateral da tela.

## Risks / Trade-offs

- [Largura dos botões] Com dois botões em linha, cada um terá ~45% da largura disponível. Em dispositivos de 5" pode ficar apertado se o texto for longo → Mitigação: "Próximo" e "Voltar" são textos curtos; manter `flex: 1` em cada botão garante distribuição uniforme.
- [Regressão no botão "Concluir"] Na última pergunta, "Próximo" vira "Concluir" — deve continuar funcionando com o mesmo estilo primário ao lado do "Voltar" → Mitigação: cobrir com teste de snapshot.
