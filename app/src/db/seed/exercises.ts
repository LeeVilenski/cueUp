import type { NewExercise } from '@/db/schema';

const SEED_TIMESTAMP = '2024-01-01T00:00:00.000Z';

function exercise(e: Omit<NewExercise, 'id' | 'isBuiltIn' | 'syncStatus' | 'remoteId' | 'createdAt' | 'updatedAt'>): NewExercise {
  return {
    ...e,
    id: e.slug,
    isBuiltIn: true,
    syncStatus: 'pending',
    remoteId: null,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  };
}

export const EXERCISES_SEED: NewExercise[] = [
  exercise({
    slug: 'line-up-15-reds',
    name: 'Line-Up Drill (15 Reds)',
    category: 'potting',
    description:
      'Place all 15 reds in a line along a cushion, each a comfortable potting distance from a pocket. Pot them one by one, repositioning the cue ball after each pot so the next red is on. The aim is to clear all 15 without a miss.',
    bestPracticeTips:
      '- Use the same cue ball speed and contact point on every pot.\n' +
      '- Re-rack and repeat 3 times, and note your best run.\n' +
      '- If you miss, reset to 0 rather than continuing — this drill rewards consistency under pressure.',
    difficulty: 'beginner',
    suggestedDurationMins: 20,
    scoringType: 'count_potted',
    scoringTarget: 15,
    scoringUnit: 'balls',
    sortOrder: 1,
  }),
  exercise({
    slug: 'the-spider-safety-routine',
    name: 'The Spider (Safety Routine)',
    category: 'safety',
    description:
      'Set up the cue ball and a red in a "spider" pattern around the table (varying angles and distances) and play a safety shot for each position, aiming to leave the cue ball tight to a cushion or tucked behind a colour.',
    bestPracticeTips:
      '- Prioritise cue ball control over pace — a safety that travels too far is a failure even if it is technically "safe".\n' +
      '- Always have a plan for where the cue ball finishes before you strike.\n' +
      '- Score a shot as successful only if your opponent would have no easy way back to the object ball.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'safeties',
    sortOrder: 2,
  }),
  exercise({
    slug: 'century-break-practice',
    name: 'Century Break Practice',
    category: 'break_building',
    description:
      'From a full rack (or a generously spread open table), attempt to compile your highest possible break. Focus on shot selection and position play rather than just potting balls.',
    bestPracticeTips:
      '- Always play the easiest pot that also sets up the best position for the next shot, not just the highest-value ball.\n' +
      '- Slow down when the table gets tight — accuracy over speed.\n' +
      '- Log your break value even if you do not clear the table; tracking small improvements over time matters most.',
    difficulty: 'advanced',
    suggestedDurationMins: 30,
    scoringType: 'break_value',
    scoringTarget: null,
    scoringUnit: 'points',
    sortOrder: 3,
  }),
  exercise({
    slug: 'stun-and-screw-control-ladder',
    name: 'Stun & Screw Control Ladder',
    category: 'cueing_fundamentals',
    description:
      'From baulk, pot a ball on a colour spot and practice making the cue ball stop dead (stun). Then repeat, screwing the cue ball back one baulk-length, then two, increasing the screw distance progressively as you master each level.',
    bestPracticeTips:
      '- Keep your cue level through impact for stun — elevation causes unwanted side effects on the cue ball.\n' +
      '- For screw, strike lower on the cue ball and accelerate smoothly through it — do not jab.\n' +
      '- Only move up a level once you can do the current one 3 times in a row.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'score_out_of',
    scoringTarget: 5,
    scoringUnit: 'levels',
    sortOrder: 4,
  }),
  exercise({
    slug: 'long-pot-consistency-drill',
    name: 'Long Pot Consistency Drill',
    category: 'potting',
    description:
      'Place a ball on the opposite spot or baulk line and pot it into a corner pocket from distance, returning the cue ball to roughly the same starting position each time. Repeat 10 times.',
    bestPracticeTips:
      '- Trust your pre-shot routine even more on long pots — give yourself an extra look at the object ball before striking.\n' +
      '- A longer, steadier bridge gives more stability over distance.\n' +
      '- Vary the angle every few attempts once you are consistently potting straight.',
    difficulty: 'intermediate',
    suggestedDurationMins: 15,
    scoringType: 'count_potted',
    scoringTarget: 10,
    scoringUnit: 'balls',
    sortOrder: 5,
  }),
  exercise({
    slug: 'pendulum-straight-cue-drill',
    name: 'Pendulum / Straight-Cue Drill',
    category: 'cueing_fundamentals',
    description:
      'Place the cue ball on the brown spot and aim down the centre line of the table at a target (a coin or chalk) on the baulk cushion. Strike a dead-straight shot and check that the cue ball returns along the same line. Repeat 10 times.',
    bestPracticeTips:
      '- Watch your cue tip at the moment of contact — it should travel straight through, not veer off-line.\n' +
      '- This drill exposes alignment issues: if the cue ball consistently drifts one way, check your stance and bridge.\n' +
      '- Do this as a warm-up before every session — it only takes a few minutes.',
    difficulty: 'beginner',
    suggestedDurationMins: 10,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'returns',
    sortOrder: 6,
  }),
  exercise({
    slug: 'pairs-colours-break-building',
    name: 'Pairs/Colours Break-Building',
    category: 'break_building',
    description:
      'Set up reds paired with colours around the table (a classic "around the table" coaching routine) and build a break by alternating red-colour-red-colour, always aiming to leave a pot on the next colour.',
    bestPracticeTips:
      '- Plan two shots ahead — the colour you are going for should set up the next red.\n' +
      '- If position on the highest-value colour is poor, take the easier colour rather than forcing it.\n' +
      '- Try to beat your previous best break in this routine each session.',
    difficulty: 'advanced',
    suggestedDurationMins: 25,
    scoringType: 'break_value',
    scoringTarget: null,
    scoringUnit: 'points',
    sortOrder: 7,
  }),
  exercise({
    slug: 'top-bottom-cushion-control',
    name: 'Top/Bottom Cushion Control',
    category: 'positional_play',
    description:
      'Pot a simple ball and practice sending the cue ball to a specific target zone (baulk cushion, top cushion, or middle of the table) using varying amounts of top spin, backspin and pace. Set a new target zone each repetition.',
    bestPracticeTips:
      '- Decide whether the shot needs follow (top) or a stop/drop-back (screw) before you even chalk up.\n' +
      '- Pace control matters as much as spin choice — the right spin with the wrong pace still misses the zone.\n' +
      '- Call your target zone out loud before each shot to build the habit of planning position.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'zones',
    sortOrder: 8,
  }),
  exercise({
    slug: 'match-simulation-vs-clock',
    name: 'Match Simulation (vs. the Clock)',
    category: 'match_practice',
    description:
      'Play a full frame, solo or against a practice partner, with added time pressure: limit your pre-shot routine to a fixed number of seconds to simulate match tempo.',
    bestPracticeTips:
      '- Replicate your match rituals exactly — same warm-up, same routine — so match day does not feel different.\n' +
      '- If you rush under the simulated pressure, that is the exact habit to work on before a real match.\n' +
      '- Log your best break from the frame, plus a note on how the tempo felt.',
    difficulty: 'advanced',
    suggestedDurationMins: 45,
    scoringType: 'break_value',
    scoringTarget: null,
    scoringUnit: 'points',
    sortOrder: 9,
  }),
  exercise({
    slug: 'all-reds-safety-to-baulk',
    name: 'All-Reds Safety to Baulk',
    category: 'safety',
    description:
      'From a red ball near a cushion, repeatedly play safety shots that finish the cue ball in the baulk area, varying the starting position of the red each time.',
    bestPracticeTips:
      '- A good safety is not just about hiding the object ball — your cue ball position matters just as much.\n' +
      '- Practice from both sides of the table — most players have a weaker safety angle.\n' +
      '- Count a shot as successful only if the cue ball lands fully inside the baulk area.',
    difficulty: 'intermediate',
    suggestedDurationMins: 15,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'safeties',
    sortOrder: 10,
  }),
  exercise({
    slug: 'cushion-first-drill',
    name: 'Cushion-First Drill (Basic Banks)',
    category: 'potting',
    description:
      'Pot balls off a single cushion (simple bank shots) from short range, gradually working toward longer banks as your accuracy improves.',
    bestPracticeTips:
      '- Fix your pace on one angle before varying it — bank shots are unforgiving on cue ball speed.\n' +
      '- Use the mirror or diamond system as a starting reference point, then adjust by feel.\n' +
      '- Start close to the pocket and only move further back once you are confident.',
    difficulty: 'beginner',
    suggestedDurationMins: 15,
    scoringType: 'count_potted',
    scoringTarget: 10,
    scoringUnit: 'balls',
    sortOrder: 11,
  }),
  exercise({
    slug: 'scatter-and-clear-15-reds',
    name: 'Scatter & Clear (15 Reds)',
    category: 'warm_up',
    description:
      'Scatter all 15 reds randomly around the table — no setup, just spread them out — then try to clear every one. Pick off whichever red looks easiest first and work your way through the pack.',
    bestPracticeTips:
      "- Don't overthink position early on — this is about loosening up, not break-building.\n" +
      '- If a red looks too risky, leave it and come back once the table opens up.\n' +
      '- Note how many you cleared before missing, and try to beat that number next time.',
    difficulty: 'beginner',
    suggestedDurationMins: 15,
    scoringType: 'count_potted',
    scoringTarget: 15,
    scoringUnit: 'balls',
    sortOrder: 12,
  }),
  exercise({
    slug: 'clear-the-colours',
    name: 'Clear the Colours',
    category: 'warm_up',
    description:
      'Place all six colours on their spots and pot them in any order, re-spotting as needed. A simple way to get a feel for pace and pocket angles all over the table before a session.',
    bestPracticeTips:
      "- Vary the order each time so you cover pockets and angles you wouldn't normally practise.\n" +
      '- Treat a missed colour as a re-spot and move on — the goal is rhythm, not a perfect run.\n' +
      '- Once comfortable, time yourself and try to beat your best time.',
    difficulty: 'beginner',
    suggestedDurationMins: 10,
    scoringType: 'count_potted',
    scoringTarget: 6,
    scoringUnit: 'colours',
    sortOrder: 13,
  }),
  exercise({
    slug: 'top-pocket-loosener',
    name: 'Top Pocket Loosener',
    category: 'warm_up',
    description:
      'Place a handful of reds near each top pocket and pot them straight in, one after another, without worrying about cue ball position. A fast way to find your stroke before getting into structured practice.',
    bestPracticeTips:
      '- Keep it relaxed — this is about smooth cueing, not pressure.\n' +
      '- Notice any early misses; they often point to something to check in your stance or alignment.\n' +
      '- A couple of minutes is enough — move on to a structured drill once you feel comfortable.',
    difficulty: 'beginner',
    suggestedDurationMins: 5,
    scoringType: 'count_potted',
    scoringTarget: 10,
    scoringUnit: 'balls',
    sortOrder: 14,
  }),
];
