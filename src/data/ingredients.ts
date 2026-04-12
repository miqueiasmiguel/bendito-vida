import type { NutrientTag } from './quiz-questions';

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  origin: string; // paraiban origin note
  nutrients: NutrientTag[];
}

// TODO: validar dados nutricionais com nutricionista antes de publicar
export const INGREDIENTS: Ingredient[] = [
  {
    id: 'gergelim',
    name: 'Gergelim',
    description: 'Semente rica em cálcio e gorduras boas, muito cultivada no Nordeste.',
    origin: 'Paraíba — Cariri Ocidental',
    nutrients: ['omega3', 'calcio', 'ferro'],
  },
  {
    id: 'feijao-verde',
    name: 'Feijão Verde',
    description: 'Leguminosa tradicional paraibana, base da alimentação regional.',
    origin: 'Paraíba — Sertão e Agreste',
    nutrients: ['proteina', 'ferro', 'fibra'],
  },
  {
    id: 'chia',
    name: 'Chia',
    description: 'Semente com alto teor de ômega-3 e fibras solúveis.',
    origin: 'Cultivada no Nordeste',
    nutrients: ['omega3', 'fibra', 'calcio'],
  },
  {
    id: 'amendoim',
    name: 'Amendoim',
    description:
      'Leguminosa amplamente produzida na Paraíba, rica em proteínas e gorduras saudáveis.',
    origin: 'Paraíba — Brejo e Agreste',
    nutrients: ['proteina', 'magnesio', 'vitamina-e'],
  },
  {
    id: 'girassol',
    name: 'Semente de Girassol',
    description: 'Rica em vitamina E e selênio, ótima fonte antioxidante.',
    origin: 'Nordeste brasileiro',
    nutrients: ['vitamina-e', 'selenio', 'magnesio'],
  },
  {
    id: 'linhaca',
    name: 'Linhaça',
    description: 'Semente com alto teor de ômega-3 e lignanas, beneficia o intestino.',
    origin: 'Cultivada no Nordeste',
    nutrients: ['omega3', 'fibra', 'magnesio'],
  },
  {
    id: 'castanha-caju',
    name: 'Castanha de Caju',
    description: 'Fruto típico do Nordeste, rico em zinco, selênio e vitamina E.',
    origin: 'Paraíba — Litoral Norte',
    nutrients: ['zinco', 'selenio', 'vitamina-e'],
  },
  {
    id: 'feijao-fradinho',
    name: 'Feijão Fradinho',
    description: 'Base do acarajé e do baião-de-dois, rico em proteínas e ferro.',
    origin: 'Paraíba — Sertão',
    nutrients: ['proteina', 'ferro', 'zinco'],
  },
  {
    id: 'sorgo',
    name: 'Sorgo',
    description: 'Grão resistente à seca, cultivado no semiárido paraibano. Sem glúten.',
    origin: 'Paraíba — Cariri e Sertão',
    nutrients: ['fibra', 'magnesio', 'cromo'],
  },
  {
    id: 'milho-palha',
    name: 'Milho de Palha',
    description: 'Variedade crioula do sertão, rica em fibras prebióticas.',
    origin: 'Paraíba — Sertão',
    nutrients: ['fibra', 'prebiotico', 'magnesio'],
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    description: 'Pseudocereal completo com todos os aminoácidos essenciais. Sem glúten.',
    origin: 'Produzida no Nordeste',
    nutrients: ['proteina', 'ferro', 'calcio'],
  },
  {
    id: 'acerola',
    name: 'Acerola',
    description: 'Uma das frutas mais ricas em vitamina C do mundo, abundante na Paraíba.',
    origin: 'Paraíba — Brejo e Litoral',
    nutrients: ['vitamina-c', 'ferro', 'calcio'],
  },
];
