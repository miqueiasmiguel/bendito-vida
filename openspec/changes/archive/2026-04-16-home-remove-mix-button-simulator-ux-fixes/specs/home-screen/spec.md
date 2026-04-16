## REMOVED Requirements

### Requirement: CTA "Montar meu Mix"
**Reason**: A navegação para o simulador já está disponível na tab bar nativa; o botão duplica a ação e polui o layout da home.
**Migration**: Remover o bloco condicional `{topNutrients.length > 0 && <Button variant="primary" label="Montar meu Mix" ...>}` de `src/app/(tabs)/home.tsx`. Verificar e remover imports não utilizados após a remoção (`Button`, possivelmente `router` se não houver outros usos).
