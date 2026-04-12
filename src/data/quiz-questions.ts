export type NutrientTag =
  | 'vitamina-c'
  | 'vitamina-b12'
  | 'vitamina-e'
  | 'omega3'
  | 'ferro'
  | 'calcio'
  | 'magnesio'
  | 'zinco'
  | 'selenio'
  | 'fibra'
  | 'proteina'
  | 'prebiotico'
  | 'cromo';

export interface QuizOption {
  id: string;
  label: string;
  tags: NutrientTag[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  multiSelect: boolean;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Qual o seu principal objetivo de saúde?',
    multiSelect: false,
    options: [
      { id: 'q1-energia', label: 'Mais energia', tags: ['ferro', 'vitamina-b12', 'magnesio'] },
      { id: 'q1-intestino', label: 'Saúde intestinal', tags: ['fibra', 'prebiotico', 'zinco'] },
      { id: 'q1-foco', label: 'Foco mental', tags: ['omega3', 'magnesio', 'vitamina-b12'] },
      { id: 'q1-peso', label: 'Controle de peso', tags: ['fibra', 'proteina', 'cromo'] },
      {
        id: 'q1-imunidade',
        label: 'Fortalecimento imunológico',
        tags: ['vitamina-c', 'zinco', 'selenio'],
      },
    ],
  },
  {
    id: 'q2',
    text: 'Como você descreveria sua disposição pela manhã?',
    multiSelect: false,
    options: [
      {
        id: 'q2-cansado',
        label: 'Acordo cansado(a)',
        tags: ['ferro', 'vitamina-b12', 'magnesio'],
      },
      { id: 'q2-normal', label: 'Normal', tags: ['fibra'] },
      { id: 'q2-disposto', label: 'Acordo bem disposto(a)', tags: ['omega3', 'selenio'] },
    ],
  },
  {
    id: 'q3',
    text: 'Com que frequência você consome grãos ou sementes?',
    multiSelect: false,
    options: [
      {
        id: 'q3-raramente',
        label: 'Raramente',
        tags: ['fibra', 'proteina', 'omega3'],
      },
      { id: 'q3-semana', label: '1-2x por semana', tags: ['fibra', 'proteina'] },
      { id: 'q3-todo-dia', label: 'Quase todo dia', tags: ['omega3', 'magnesio'] },
    ],
  },
  {
    id: 'q4',
    text: 'Você tem alguma restrição alimentar?',
    multiSelect: true,
    options: [
      { id: 'q4-gluten', label: 'Glúten', tags: [] },
      { id: 'q4-lactose', label: 'Lactose', tags: [] },
      { id: 'q4-nozes', label: 'Nozes', tags: [] },
      { id: 'q4-nenhuma', label: 'Nenhuma', tags: ['omega3', 'proteina'] },
    ],
  },
  {
    id: 'q5',
    text: 'O que mais te motiva a comer melhor?',
    multiSelect: false,
    options: [
      {
        id: 'q5-saude',
        label: 'Saúde a longo prazo',
        tags: ['vitamina-c', 'selenio', 'zinco'],
      },
      { id: 'q5-estetica', label: 'Estética', tags: ['proteina', 'cromo', 'vitamina-e'] },
      {
        id: 'q5-medico',
        label: 'Recomendação médica',
        tags: ['vitamina-b12', 'ferro', 'calcio'],
      },
      { id: 'q5-curiosidade', label: 'Curiosidade', tags: ['omega3', 'fibra'] },
    ],
  },
];
