export type Routine = {
  id: string;
  name: string;
  description: string;
  exerciseIds: string[];
};

export const ROUTINES: Routine[] = [
  {
    id: 'potting-focus',
    name: '30-min Potting Focus',
    description: 'Build potting consistency from short, medium and bank angles.',
    exerciseIds: ['line-up-15-reds', 'long-pot-consistency-drill', 'cushion-first-drill'],
  },
  {
    id: 'break-building',
    name: 'Break-Building Session',
    description: 'Warm up your cueing, then work on stringing shots together.',
    exerciseIds: ['pendulum-straight-cue-drill', 'pairs-colours-break-building', 'century-break-practice'],
  },
  {
    id: 'safety-position',
    name: 'Safety & Position Mix',
    description: 'Sharpen safety play and cue-ball control around the table.',
    exerciseIds: ['the-spider-safety-routine', 'top-bottom-cushion-control', 'all-reds-safety-to-baulk'],
  },
];
