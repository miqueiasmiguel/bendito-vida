## 1. TodayStatusCard — novo componente

- [x] 1.1 Criar `src/components/dashboard/TodayStatusCard.tsx` com interface de props `{ checkin?: CheckinEntry | null; onPress?: () => void }`
- [x] 1.2 Implementar estado "check-in realizado": 3 colunas com ícone Lucide (Zap/Moon/Brain), valor numérico e label para cada score
- [x] 1.3 Implementar estado "sem check-in": ícone `<ClipboardList />`, headline "Como você está hoje?", botão secundário "Registrar meu dia"
- [x] 1.4 Tornar o card inteiramente tocável (`TouchableOpacity`) com navegação para `/(tabs)/progress`
- [x] 1.5 Adicionar `accessibilityRole="button"` e `accessibilityLabel` descritivo em cada score ("Energia: X de 5")
- [x] 1.6 Usar exclusivamente tokens do tema (cores, tipografia, espaçamento) — zero hardcode
- [x] 1.7 Escrever teste unitário mínimo: renderiza estado com check-in e estado sem check-in

## 2. SimulatorCtaCard — novo componente

- [x] 2.1 Criar `src/components/dashboard/SimulatorCtaCard.tsx` com fundo `primary-700`, radius 16, padding 20, sombra elevada
- [x] 2.2 Adicionar ícone `<FlaskConical />` (size=32, cor `neutral-50`), headline branca "Monte seu Mix do dia" e subtítulo em `primary-100`
- [x] 2.3 Adicionar botão primário (accent) "Montar meu Mix" que navega para `/(tabs)/simulator`
- [x] 2.4 Tornar o card inteiro tocável, com `accessibilityRole="button"` e `accessibilityLabel="Montar meu Mix — acessar simulador"`
- [x] 2.5 Escrever teste unitário mínimo: renderiza headline e dispara navegação ao toque

## 3. Atualizar exports do dashboard

- [x] 3.1 Exportar `TodayStatusCard` e `SimulatorCtaCard` em `src/components/dashboard/index.ts` (ou criar o arquivo se não existir)

## 4. Redesign de `home.tsx`

- [x] 4.1 Remover `WeeklyCheckinCard` e a lógica de busca do check-in de hoje (`existingCheckin`) de `home.tsx`
- [x] 4.2 Importar `TodayStatusCard` e `SimulatorCtaCard`
- [x] 4.3 Reordenar seções: Saudação → `SimulatorCtaCard` → `BioactiveMap` → `TodayStatusCard` → `DailyTip`
- [x] 4.4 Buscar check-in de hoje via `useProgressStore` e passar como prop para `TodayStatusCard`
- [x] 4.5 Atualizar subtítulo da saudação para "Veja o que preparamos para você hoje."
- [x] 4.6 Remover imports não utilizados (`WeeklyCheckinCard`, `CheckinValues`)

## 5. Verificação final

- [x] 5.1 Confirmar que `WeeklyCheckinCard` em `progress.tsx` continua funcionando sem alterações
- [x] 5.2 Rodar `npm run validate` (lint + type-check + testes) — zero erros
- [ ] 5.3 Verificar manualmente o fluxo: Home → SimulatorCtaCard → Simulador e Home → TodayStatusCard → Evolução
