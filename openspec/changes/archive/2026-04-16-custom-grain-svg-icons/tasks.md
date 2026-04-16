## 1. Estrutura e tipos base

- [x] 1.1 Criar diretório `src/assets/icons/grains/` e o arquivo `GenericGrainIcon.tsx` (semente genérica, fallback)
- [x] 1.2 Definir interface `GrainIconBaseProps` (`size?: number`, `color?: string`) em `src/assets/icons/grains/types.ts`
- [x] 1.3 Criar componente `GrainIcon.tsx` em `src/components/ui/` com mapa vazio e fallback para `GenericGrainIcon`
- [x] 1.4 Exportar `GrainIcon` via `src/components/ui/index.ts`

## 2. Ícones SVG dos ingredientes

- [x] 2.1 Criar `GergelimIcon.tsx` — sementes de gergelim (pequenos círculos/ovais agrupados)
- [x] 2.2 Criar `ChiaIcon.tsx` — sementes de chia (padrão de pontos/oval pequeno com textura)
- [x] 2.3 Criar `LinhacaIcon.tsx` — semente de linhaça (forma oval alongada com nervura central)
- [x] 2.4 Criar `AmendoimIcon.tsx` — amendoim (forma de casca característica com sulco central)
- [x] 2.5 Criar `GirassolIcon.tsx` — semente de girassol (oval com estrias, centro de flor estilizado)
- [x] 2.6 Criar `FeijaoVerdeIcon.tsx` — feijão (forma de rim/rim arredondado)
- [x] 2.7 Criar `FeijaoFradinhoIcon.tsx` — feijão fradinho (oval com ponto/olho branco característico)
- [x] 2.8 Criar `CastanhaCajuIcon.tsx` — castanha de caju (forma em meia-lua/rim curvo)
- [x] 2.9 Criar `SorgoIcon.tsx` — sorgo (panícula — haste com grãos esféricos agrupados no topo)
- [x] 2.10 Criar `MilhoPalhaIcon.tsx` — milho (espiga estilizada com grãos e folha)
- [x] 2.11 Criar `QuinoaIcon.tsx` — quinoa (panícula densa, pequenos círculos em cacho)
- [x] 2.12 Criar `AcerolaIcon.tsx` — acerola (fruta redonda com folhinhas, divisões de drupa)

## 3. Registro no mapa GrainIcon

- [x] 3.1 Importar todos os 12 ícones no `GrainIcon.tsx` e registrar no `GRAIN_ICON_MAP`
- [x] 3.2 Adicionar comentário no `GrainIcon.tsx` explicando como registrar novos grãos futuros

## 4. Integração no IngredientCard

- [x] 4.1 Substituir o `View colorDot` (28×28) por um `View` circular de 40×40 com `backgroundColor: ingredient.color` contendo `GrainIcon` centralizado (`size={22}`, `color="#FFFFFF"`)
- [x] 4.2 Remover a importação e uso do estilo `colorDot` do `IngredientCard`
- [x] 4.3 Verificar que `overflow: 'visible'` e badges/selos continuam funcionando após a mudança

## 5. Testes

- [x] 5.1 Escrever teste unitário para `GrainIcon`: ingrediente conhecido renderiza sem fallback, ingrediente desconhecido renderiza `GenericGrainIcon`
- [x] 5.2 Atualizar snapshot/teste do `IngredientCard` para refletir o novo elemento de ícone no lugar do `colorDot`
- [x] 5.3 Executar `npm run validate` e garantir zero erros de lint/type

## 6. Verificação visual

- [ ] 6.1 Abrir o simulador no dev build e confirmar que cada ícone é legível e reconhecível em 40×40px
- [ ] 6.2 Confirmar que o fundo colorido, os selos paraibanos e os badges de quantidade continuam corretos
- [ ] 6.3 Confirmar que o `GrainIcon` com `ingredientId` desconhecido exibe o fallback genérico sem crashes

