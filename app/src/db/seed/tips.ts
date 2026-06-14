import type { Tip } from '@/db/schema';

type TipSeed = Omit<Tip, 'id'> & { id: string };

export const TIPS_SEED: TipSeed[] = [
  {
    id: 'pre-shot-routine',
    slug: 'pre-shot-routine',
    title: 'Pre-shot routine',
    category: 'fundamentals',
    body:
      '- Use the same number of practice strokes on every shot, no matter how easy or hard.\n' +
      '- Take a final, still look at the object ball (and the pot angle) immediately before striking.\n' +
      '- Build a routine you can repeat under pressure — consistency here reduces nerves in matches.',
    sortOrder: 1,
  },
  {
    id: 'stance-and-grip-fundamentals',
    slug: 'stance-and-grip-fundamentals',
    title: 'Stance & grip fundamentals',
    category: 'fundamentals',
    body:
      '- Keep your head still and down through the shot — most cueing errors come from lifting up early.\n' +
      '- Your feet should give you a stable base with your dominant eye over the cue.\n' +
      '- Keep your bridge hand relaxed but firm; a tense bridge restricts the cue\'s travel.',
    sortOrder: 2,
  },
  {
    id: 'cue-action-and-follow-through',
    slug: 'cue-action-and-follow-through',
    title: 'Cue action & follow-through',
    category: 'cueing',
    body:
      '- Keep the backswing straight and smooth — avoid snatching the cue back quickly.\n' +
      '- Accelerate smoothly into the cue ball rather than hitting hardest at the start of the stroke.\n' +
      '- Follow through down the intended line after contact; stopping the cue early often causes mis-cues.',
    sortOrder: 3,
  },
  {
    id: 'shot-selection-mindset',
    slug: 'shot-selection-mindset',
    title: 'Shot selection mindset',
    category: 'mental_game',
    body:
      '- Before every shot, decide where you want the cue ball to finish — not just which ball you are potting.\n' +
      '- If there is no good position after the "obvious" pot, look for an alternative that leaves a better next shot.\n' +
      '- When in doubt, choose the higher-percentage shot — a missed difficult pot is usually worse than a safe, simple one.',
    sortOrder: 4,
  },
  {
    id: 'safety-mentality',
    slug: 'safety-mentality',
    title: 'Safety mentality',
    category: 'safety_mindset',
    body:
      '- Know when to play safe versus attack — forcing a low-percentage pot often hands the table back to your opponent.\n' +
      '- A safety that leaves an easy return shot is not actually "safe" — think one shot ahead for your opponent too.\n' +
      '- Practising safety shots is just as valuable as practising pots; it is where frames are often won or lost.',
    sortOrder: 5,
  },
  {
    id: 'structuring-practice-time',
    slug: 'structuring-practice-time',
    title: 'Structuring your practice time',
    category: 'practice_habits',
    body:
      '- Mix potting, safety, break-building and positional play in every session rather than only potting balls.\n' +
      '- Warm up with a simple cueing drill (e.g. the Pendulum drill) before moving on to harder routines.\n' +
      '- Track your results — small, measurable improvements over weeks add up to real progress in matches.',
    sortOrder: 6,
  },
];
