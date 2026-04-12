# FEATURES.md — Especificações de Funcionalidades

> **Quando ler:** Antes de implementar cada tela/feature. Não precisa carregar tudo de uma vez — leia a seção relevante para a tarefa atual.

---

## Navegação — Native Tabs Layout

```typescript
// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { House, FlaskConical, TrendingUp, User } from 'lucide-react-native';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.neutral[200],
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => <House color={color} size={size} strokeWidth={2} />,
      }} />
      <Tabs.Screen name="simulator" options={{
        title: 'Meu Mix',
        tabBarIcon: ({ color, size }) => <FlaskConical color={color} size={size} strokeWidth={2} />,
      }} />
      <Tabs.Screen name="progress" options={{
        title: 'Evolução',
        tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} strokeWidth={2} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Perfil',
        tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2} />,
      }} />
    </Tabs>
  );
}
```

---

## Tela 1: Welcome / Splash

- Background `primary-700` com logo centralizada
- Animação de entrada: logo + grãos caindo (Reanimated 4)
- Botões: "Começar" (accent CTA) e "Já tenho conta" (link)

---

## Tela 2: Quiz de Triagem Nutricional

**Fluxo:** 5-6 perguntas, uma por vez, transição horizontal.

**Perguntas:**

1. "Qual o seu principal objetivo de saúde?" → Mais energia, Saúde intestinal, Foco mental, Controle de peso, Fortalecimento imunológico
2. "Como você descreveria sua disposição pela manhã?" → Acordo cansado(a), Normal, Acordo bem disposto(a)
3. "Com que frequência você consome grãos ou sementes?" → Raramente, 1-2x por semana, Quase todo dia
4. "Você tem alguma restrição alimentar?" → Multi-seleção: Glúten, Lactose, Nozes, Nenhuma
5. "O que mais te motiva a comer melhor?" → Saúde a longo prazo, Estética, Recomendação médica, Curiosidade

**UI:** Barra de progresso topo (3/5). Cards de opção com borda `primary-700` quando ativo. Botão "Próximo" (accent) aparece após seleção.

**Algoritmo:** Cada resposta mapeia para tags de nutrientes ("foco mental" → omega3, magnésio). Perfil final = soma ponderada das tags. Gera "Mapa Bioativo" com 3 nutrientes prioritários + ingredientes sugeridos.

---

## Tela 3: Home (Mapa Bioativo)

- "Olá, [Nome]!"
- **Mapa Bioativo:** Card com 3 nutrientes prioritários (ícones + barras) + 3-5 ingredientes recomendados (badge "Paraibano" se aplicável)
- **CTA:** "Montar meu Mix" → Simulador
- Card "Check-in semanal" se disponível
- Dica do dia (texto curto sobre ingrediente)

---

## Tela 4: Simulador "Meu Mix" (CORE FEATURE)

**A funcionalidade mais importante para o edital. Deve ser visualmente impactante e fluida.**

**Layout:**
- **Superior (40%):** Jarro virtual (SVG). Enche com cores dos ingredientes adicionados. Animação suave Reanimated 4.
- **Inferior (60%):** Lista horizontal scrollável de IngredientCards (nome, ícone, badge "Paraibano").

**Interação:**
- Toque ingrediente → adiciona ao jarro (animação "cair dentro")
- Toque ingrediente no jarro → remove
- **4 barras dinâmicas** abaixo do jarro: Fibras (verde), Proteínas (azul), Ômega-3 (dourado), Calorias (vermelho se alto). Atualizam <200ms via cálculo local.

**Nudges (toasts contextuais):**
- Mix calórico → "Seu mix está bem calórico. Que tal trocar por [alternativa]?"
- Falta nutriente → "Para melhorar [objetivo], adicione [ingrediente]"
- Ingrediente paraibano → "Licuri — tesouro do semiárido paraibano!"

**Ação final:** Botão "Gerar Minha Receita" (accent, fixo bottom) → tela resultado.

---

## Tela 5: Cartão de Receita

Card estilizado/compartilhável:
- Nome: "Mix [Objetivo] do [Nome]"
- Lista ingredientes + proporções
- Resumo nutricional (4 indicadores)
- Badge "Contém ingredientes da biodiversidade paraibana"
- Botões: "Compartilhar" (expo-sharing), "Salvar no perfil"

---

## Tela 6: Dashboard de Evolução

- **Check-in semanal:** 3 escalas 1-5: Disposição, Sono, Foco
- **Gráfico de linha** (react-native-chart-kit): X=semanas, Y=score médio. Linha secundária opcional (frequência de consumo).
- Insight: "Sua disposição melhorou 20% desde que começou."

---

## Tela 7: Perfil

Avatar + nome + data cadastro. Mapa Bioativo resumido. Mixes salvos. Configurações. Logout.

---

## Base de Dados de Ingredientes

```typescript
// src/data/ingredients.ts

export interface Ingredient {
  id: string;
  name: string;
  category: 'grao' | 'semente' | 'fruto' | 'farinha' | 'granola';
  isParaibano: boolean;
  description: string;
  color: string;              // Cor representativa (jarro)
  icon: string;               // Lucide icon name
  nutrition: {                // Por 30g (porção padrão)
    calories: number;
    fiber: number;
    protein: number;
    omega3: number;
  };
  tags: string[];
  benefit: string;
}

// ⚠️ PLACEHOLDERS — Validar com nutricionista antes da submissão.
export const ingredients: Ingredient[] = [
  {
    id: 'licuri', name: 'Licuri', category: 'fruto', isParaibano: true,
    description: 'Fruto do semiárido nordestino, rico em óleos e fibras.',
    color: '#C4A265', icon: 'circle-dot',
    nutrition: { calories: 190, fiber: 3.2, protein: 2.8, omega3: 0.1 },
    tags: ['energia', 'imunidade'], benefit: 'Fonte de energia do sertão',
  },
  {
    id: 'gergelim', name: 'Gergelim', category: 'semente', isParaibano: true,
    description: 'Semente tradicional da agricultura familiar paraibana.',
    color: '#F5E6C8', icon: 'grain',
    nutrition: { calories: 172, fiber: 3.5, protein: 5.3, omega3: 0.1 },
    tags: ['foco', 'ossos'], benefit: 'Rico em cálcio e magnésio',
  },
  {
    id: 'fava', name: 'Fava', category: 'grao', isParaibano: true,
    description: 'Leguminosa resistente ao clima semiárido.',
    color: '#8B7355', icon: 'bean',
    nutrition: { calories: 88, fiber: 5.1, protein: 7.6, omega3: 0 },
    tags: ['intestino', 'saciedade', 'proteina'], benefit: 'Alta proteína vegetal',
  },
  {
    id: 'castanha-caju', name: 'Castanha de Caju', category: 'fruto', isParaibano: true,
    description: 'Produto emblemático do Nordeste brasileiro.',
    color: '#DEB887', icon: 'nut',
    nutrition: { calories: 165, fiber: 1.0, protein: 5.2, omega3: 0.02 },
    tags: ['foco', 'energia', 'imunidade'], benefit: 'Fonte de zinco e selênio',
  },
  {
    id: 'chia', name: 'Semente de Chia', category: 'semente', isParaibano: false,
    description: 'Superalimento rico em ômega-3 vegetal.',
    color: '#2F2F2F', icon: 'sparkles',
    nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
    tags: ['intestino', 'foco', 'omega'], benefit: 'Campeã de ômega-3 vegetal',
  },
  {
    id: 'linhaca', name: 'Linhaça Dourada', category: 'semente', isParaibano: false,
    description: 'Semente com alto teor de fibras e lignanas.',
    color: '#B8860B', icon: 'wheat',
    nutrition: { calories: 160, fiber: 8.1, protein: 5.5, omega3: 6.8 },
    tags: ['intestino', 'coracao', 'omega'], benefit: 'Rica em lignanas antioxidantes',
  },
  {
    id: 'aveia', name: 'Aveia em Flocos', category: 'grao', isParaibano: false,
    description: 'Cereal integral clássico para energia sustentada.',
    color: '#F5DEB3', icon: 'wheat',
    nutrition: { calories: 117, fiber: 3.1, protein: 4.2, omega3: 0.03 },
    tags: ['energia', 'intestino', 'saciedade'], benefit: 'Beta-glucana para o coração',
  },
  {
    id: 'granola-bendito', name: 'Granola Bendito Grão', category: 'granola', isParaibano: true,
    description: 'Blend artesanal da Bendito Grão Store.',
    color: '#CD853F', icon: 'package',
    nutrition: { calories: 140, fiber: 3.0, protein: 3.5, omega3: 0.2 },
    tags: ['energia', 'praticidade'], benefit: 'O melhor da Bendito Grão em um blend',
  },
];
```

---

## Motor Nutricional

```typescript
// src/data/nutrition-engine.ts
import type { Ingredient } from './ingredients';

export interface NutritionSummary {
  calories: number; fiber: number; protein: number; omega3: number;
}

export interface NudgeMessage {
  type: 'warning' | 'suggestion' | 'info';
  message: string;
}

export function calculateNutrition(selected: Ingredient[]): NutritionSummary {
  return selected.reduce(
    (acc, ing) => ({
      calories: acc.calories + ing.nutrition.calories,
      fiber: acc.fiber + ing.nutrition.fiber,
      protein: acc.protein + ing.nutrition.protein,
      omega3: acc.omega3 + ing.nutrition.omega3,
    }),
    { calories: 0, fiber: 0, protein: 0, omega3: 0 },
  );
}

const CALORIE_WARN = 500;
const FIBER_LOW = 5;

export function generateNudges(
  nutrition: NutritionSummary,
  selected: Ingredient[],
  userTags: string[],
): NudgeMessage[] {
  const nudges: NudgeMessage[] = [];

  if (nutrition.calories > CALORIE_WARN)
    nudges.push({ type: 'warning', message: 'Seu mix está bem calórico. Considere reduzir um ingrediente.' });

  if (nutrition.fiber < FIBER_LOW && selected.length >= 2)
    nudges.push({ type: 'suggestion', message: 'Adicione chia ou linhaça para turbinar as fibras!' });

  if (userTags.includes('foco') && nutrition.omega3 < 2)
    nudges.push({ type: 'suggestion', message: 'Para melhorar o foco, adicione sementes ricas em ômega-3.' });

  const lastAdded = selected[selected.length - 1];
  if (lastAdded?.isParaibano)
    nudges.push({ type: 'info', message: `${lastAdded.name} — da biodiversidade paraibana!` });

  return nudges;
}
```

---

## Banco de Dados (Supabase)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  quiz_completed BOOLEAN DEFAULT false,
  bioactive_profile JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  nutrition JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  energy_score INT CHECK (energy_score BETWEEN 1 AND 5),
  sleep_score INT CHECK (sleep_score BETWEEN 1 AND 5),
  focus_score INT CHECK (focus_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own mixes" ON mixes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own checkins" ON checkins FOR ALL USING (auth.uid() = user_id);
```