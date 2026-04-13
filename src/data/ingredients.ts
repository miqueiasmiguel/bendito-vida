import type { NutrientTag } from './quiz-questions';

export interface IngredientNutrition {
  calories: number; // kcal per 30g serving
  fiber: number; // grams
  protein: number; // grams
  omega3: number; // grams
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  origin: string;
  nutrients: NutrientTag[];
  isParaibano: boolean;
  color: string; // representative color for jar fill
  nutrition: IngredientNutrition; // ⚠️ PLACEHOLDER — validate with nutritionist
}

// ⚠️ NUTRITION DATA: PLACEHOLDERS — Validar com nutricionista antes de publicar.
export const INGREDIENTS: Ingredient[] = [
  {
    id: 'gergelim',
    name: 'Gergelim',
    description: 'Semente rica em cálcio e gorduras boas, muito cultivada no Nordeste.',
    origin: 'Paraíba — Cariri Ocidental',
    nutrients: ['omega3', 'calcio', 'ferro'],
    isParaibano: true,
    color: '#F5E6C8',
    nutrition: { calories: 172, fiber: 3.5, protein: 5.3, omega3: 0.1 },
  },
  {
    id: 'feijao-verde',
    name: 'Feijão Verde',
    description: 'Leguminosa tradicional paraibana, base da alimentação regional.',
    origin: 'Paraíba — Sertão e Agreste',
    nutrients: ['proteina', 'ferro', 'fibra'],
    isParaibano: true,
    color: '#6B8E5E',
    nutrition: { calories: 88, fiber: 5.1, protein: 7.6, omega3: 0 },
  },
  {
    id: 'chia',
    name: 'Chia',
    description: 'Semente com alto teor de ômega-3 e fibras solúveis.',
    origin: 'Cultivada no Nordeste',
    nutrients: ['omega3', 'fibra', 'calcio'],
    isParaibano: false,
    color: '#2F2F2F',
    nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
  },
  {
    id: 'amendoim',
    name: 'Amendoim',
    description:
      'Leguminosa amplamente produzida na Paraíba, rica em proteínas e gorduras saudáveis.',
    origin: 'Paraíba — Brejo e Agreste',
    nutrients: ['proteina', 'magnesio', 'vitamina-e'],
    isParaibano: true,
    color: '#C4A265',
    nutrition: { calories: 172, fiber: 2.1, protein: 7.6, omega3: 0.01 },
  },
  {
    id: 'girassol',
    name: 'Semente de Girassol',
    description: 'Rica em vitamina E e selênio, ótima fonte antioxidante.',
    origin: 'Nordeste brasileiro',
    nutrients: ['vitamina-e', 'selenio', 'magnesio'],
    isParaibano: false,
    color: '#F5C842',
    nutrition: { calories: 175, fiber: 2.5, protein: 6.2, omega3: 0.08 },
  },
  {
    id: 'linhaca',
    name: 'Linhaça',
    description: 'Semente com alto teor de ômega-3 e lignanas, beneficia o intestino.',
    origin: 'Cultivada no Nordeste',
    nutrients: ['omega3', 'fibra', 'magnesio'],
    isParaibano: false,
    color: '#B8860B',
    nutrition: { calories: 160, fiber: 8.1, protein: 5.5, omega3: 6.8 },
  },
  {
    id: 'castanha-caju',
    name: 'Castanha de Caju',
    description: 'Fruto típico do Nordeste, rico em zinco, selênio e vitamina E.',
    origin: 'Paraíba — Litoral Norte',
    nutrients: ['zinco', 'selenio', 'vitamina-e'],
    isParaibano: true,
    color: '#DEB887',
    nutrition: { calories: 165, fiber: 1.0, protein: 5.2, omega3: 0.02 },
  },
  {
    id: 'feijao-fradinho',
    name: 'Feijão Fradinho',
    description: 'Base do acarajé e do baião-de-dois, rico em proteínas e ferro.',
    origin: 'Paraíba — Sertão',
    nutrients: ['proteina', 'ferro', 'zinco'],
    isParaibano: true,
    color: '#A0845C',
    nutrition: { calories: 96, fiber: 4.8, protein: 7.2, omega3: 0 },
  },
  {
    id: 'sorgo',
    name: 'Sorgo',
    description: 'Grão resistente à seca, cultivado no semiárido paraibano. Sem glúten.',
    origin: 'Paraíba — Cariri e Sertão',
    nutrients: ['fibra', 'magnesio', 'cromo'],
    isParaibano: true,
    color: '#D2691E',
    nutrition: { calories: 103, fiber: 3.2, protein: 3.6, omega3: 0.02 },
  },
  {
    id: 'milho-palha',
    name: 'Milho de Palha',
    description: 'Variedade crioula do sertão, rica em fibras prebióticas.',
    origin: 'Paraíba — Sertão',
    nutrients: ['fibra', 'prebiotico', 'magnesio'],
    isParaibano: true,
    color: '#F4D03F',
    nutrition: { calories: 108, fiber: 3.9, protein: 3.1, omega3: 0.01 },
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    description: 'Pseudocereal completo com todos os aminoácidos essenciais. Sem glúten.',
    origin: 'Produzida no Nordeste',
    nutrients: ['proteina', 'ferro', 'calcio'],
    isParaibano: false,
    color: '#E8D5B7',
    nutrition: { calories: 111, fiber: 2.6, protein: 4.1, omega3: 0.08 },
  },
  {
    id: 'acerola',
    name: 'Acerola',
    description: 'Uma das frutas mais ricas em vitamina C do mundo, abundante na Paraíba.',
    origin: 'Paraíba — Brejo e Litoral',
    nutrients: ['vitamina-c', 'ferro', 'calcio'],
    isParaibano: true,
    color: '#E74C3C',
    nutrition: { calories: 16, fiber: 1.4, protein: 0.5, omega3: 0 },
  },
];
