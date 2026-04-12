## Context

O app já tem Welcome Screen (`/`) e estrutura de navegação com grupos `(auth)`, `(onboarding)` e `(tabs)` — todos com placeholders. O Quiz de Triagem é a segunda tela do fluxo principal (Welcome → Quiz → Home) e é o único ponto onde o perfil nutricional do usuário é coletado. Todo o cálculo deve ser local (sem chamada de API) para garantir resposta em <200ms conforme requisito de performance do projeto.

## Goals / Non-Goals

**Goals:**
- Implementar o fluxo completo de 5 perguntas com navegação horizontal entre steps
- Algoritmo de mapeamento resposta → tags de nutrientes rodando localmente
- Persistência do perfil via Zustand antes de navegar para Home
- UI fiel ao design system (progress bar, cards de seleção, botão accent)
- Cobertura de testes ≥60% dos novos módulos

**Non-Goals:**
- Salvar perfil no Supabase (isso pertence ao fluxo de Auth, futuro)
- Suporte a mais de 6 perguntas ou lógica condicional entre perguntas
- Animação de entrada de grãos (já pertence à Welcome Screen)
- Edição do perfil pós-quiz (pertence à tela Perfil)

## Decisions

### 1. Estado do quiz via Zustand local (não React state)

O perfil calculado precisa persistir além da tela do quiz para ser consumido pela Home e pelo Simulador. Usar Zustand alinha com o padrão já definido no projeto (`useQuizStore`) e evita prop drilling.

**Alternativa considerada:** React Context — descartada porque o projeto já define Zustand como padrão para estado cross-tela.

### 2. Paginação horizontal com `FlatList` horizontal + `scrollToIndex`

Transição entre perguntas feita com `FlatList` paginada (horizontal, `pagingEnabled`). É a solução mais simples e nativa, sem biblioteca extra.

**Alternativa considerada:** Reanimated 4 `useAnimatedStyle` com `translateX` manual — mais controle, mas mais código. Reservar Reanimated para microinterações (card selecionado), não para a paginação em si. FlatList já usa scroll nativo (UI thread), suficiente aqui.

### 3. Estrutura de dados: `quiz-questions.ts` com mapeamento de nutrientes inline

Cada opção de resposta carrega um array de tags de nutrientes diretamente no arquivo de dados. O algoritmo em `match-profile.ts` faz `reduce` sobre as respostas selecionadas para calcular pontuação por nutriente.

```typescript
// Estrutura de dados
interface QuizOption {
  id: string;
  label: string;
  tags: NutrientTag[];  // ex: ['omega3', 'magnesio']
}

interface QuizQuestion {
  id: string;
  text: string;
  multiSelect: boolean;
  options: QuizOption[];
}
```

**Alternativa considerada:** Tags em arquivo separado de mapeamento — descartada por adicionar indireção desnecessária para 5 perguntas.

### 4. Botão "Próximo" desabilitado vs. oculto

O botão "Próximo" aparece somente após seleção (conforme spec). Implementar com `opacity: 0` + `pointerEvents: 'none'` via Reanimated 4 `useAnimatedStyle` para transição suave (300ms ease-out), ao invés de conditional render que causaria layout shift.

### 5. Multi-seleção na pergunta 4 (restrições)

Opção "Nenhuma" é mutuamente exclusiva com as demais. Ao selecionar "Nenhuma", desmarcar todas as outras. Ao selecionar qualquer outra, desmarcar "Nenhuma". Lógica implementada no `useQuizStore`.

## Risks / Trade-offs

- **[Risco] FlatList com `scrollToIndex` pode falhar se o item não estiver renderizado** → Mitigação: usar `getItemLayout` com largura fixa (100% da tela) para garantir scroll programático preciso.
- **[Risco] Algoritmo de perfil pode gerar empates entre nutrientes** → Mitigação: desempate por ordem de precedência definida no array de nutrientes (ex: vitaminas antes de minerais). Aceitável para MVP.
- **[Trade-off] Dados nutricionais marcados como placeholder** → O mapeamento resposta→nutriente usa tags baseadas na spec, mas os valores de referência dos ingredientes são marcados `// TODO: validar com nutricionista` até revisão profissional.

## Migration Plan

1. Substituir placeholder `/(onboarding)/quiz.tsx` pela implementação real
2. Atualizar `src/app/index.tsx`: botão "Começar" navega para `/(onboarding)/quiz`
3. Criar `useQuizStore` com ação `setProfile` e estado `nutritionProfile`
4. Ao concluir quiz, navegar para `/(tabs)/home` via `router.replace`
5. Sem rollback necessário (feature nova, não substitui comportamento existente)

## Open Questions

- Os ingredientes sugeridos no perfil devem vir de uma lista fixa em `data/ingredients.ts` — esse arquivo ainda não existe. Criar com dados placeholder ou aguardar a tela Home? **Decisão:** Criar `ingredients.ts` com pelo menos 10 ingredientes paraibanos placeholder para o quiz poder gerar sugestões.
