## 1. Leitura e diagnóstico

- [x] 1.1 Ler `src/app/(onboarding)/quiz.tsx` e mapear onde a barra de progresso e os botões são renderizados
- [x] 1.2 Verificar se existe componente de barra de progresso em `src/components/quiz/` ou `src/components/ui/`

## 2. Barra de progresso centralizada

- [x] 2.1 Envolver o container da barra de progresso em `View` com `alignItems: 'center'` (ou ajustar estilo existente)
- [x] 2.2 Verificar visualmente em simulador (5" e 6.7") que a barra está centrada

## 3. Layout de botões lado a lado

- [x] 3.1 Criar container `View` com `flexDirection: 'row'` e `gap: spacing.md` para os botões de ação
- [x] 3.2 Aplicar `flex: 1` em cada botão para distribuição uniforme
- [x] 3.3 Adicionar botão "Voltar" como `Button` secundário (variant secondary, `accessibilityLabel="Voltar para a pergunta anterior"`)
- [x] 3.4 Implementar renderização condicional: `{currentStep > 1 && <BackButton />}` (ocultar na pergunta 1)
- [x] 3.5 Conectar botão "Voltar" à lógica de navegação para a pergunta anterior (decrementar step, preservar seleção)

## 4. Testes

- [x] 4.1 Atualizar teste unitário / snapshot existente do quiz para refletir novo layout
- [x] 4.2 Adicionar teste: botão "Voltar" oculto na pergunta 1
- [x] 4.3 Adicionar teste: botão "Voltar" visível nas perguntas 2-5
- [x] 4.4 Adicionar teste: toque em "Voltar" retorna à pergunta anterior preservando seleção
