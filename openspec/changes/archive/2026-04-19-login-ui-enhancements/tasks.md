## 1. Componente GoogleIcon

- [x] 1.1 Criar `src/components/ui/GoogleIcon.tsx` com SVG inline do logo oficial do Google (4 cores: #4285F4, #34A853, #FBBC05, #EA4335), tamanho padrão 20x20
- [x] 1.2 Adicionar prop `leftIcon?: React.ReactNode` à interface `ButtonProps` em `src/components/ui/Button.tsx`
- [x] 1.3 Atualizar o layout interno do `Button` para usar `flexDirection: 'row'` e renderizar `leftIcon` à esquerda do texto quando fornecido
- [x] 1.4 Exportar `GoogleIcon` em `src/components/ui/index.ts`
- [x] 1.5 Adicionar teste unitário para `GoogleIcon` em `src/components/ui/__tests__/GoogleIcon.test.tsx`

## 2. Atualização da Tela Welcome

- [x] 2.1 Importar `GoogleIcon` em `src/app/index.tsx` e passar como `leftIcon` ao `Button` "Entrar com Google"
- [x] 2.2 Adicionar componente de aviso de privacidade abaixo do `Button` usando `Text` com `Linking.openURL` para o link `https://miqueiasmiguel.github.io/bendito-vida/privacy-policy.html`
- [x] 2.3 Estilizar o texto do aviso com `typography.fontSize.caption` (13px), cor `rgba(255,255,255,0.8)` (legível sobre `primary-700`), e o trecho "política de privacidade" com sublinhado e cor branca

## 3. Testes e Validação

- [x] 3.1 Atualizar o snapshot/teste existente da tela Welcome em `src/app/__tests__/` se houver
- [x] 3.2 Verificar que `npm run validate` passa (lint + tipos + testes)
- [ ] 3.3 Confirmar visualmente no dev build que o ícone aparece no botão e o link abre o browser externo
