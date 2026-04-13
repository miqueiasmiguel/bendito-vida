## MODIFIED Requirements

### Requirement: Navegação pós-conclusão do quiz
Ao responder a última pergunta e confirmar, o sistema SHALL navegar para `/(tabs)/home` usando `router.replace` (não `router.push`), para que o stack de navegação não permita voltar ao quiz após a conclusão.

#### Scenario: Conclusão do quiz
- **WHEN** usuário confirma a resposta da última pergunta (pergunta 5)
- **THEN** app navega para `/(tabs)/home` via `router.replace`, impedindo retorno ao quiz via botão Voltar
