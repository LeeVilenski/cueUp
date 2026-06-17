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
      'Place all 15 reds in a line down the centre of the table, evenly spaced from the baulk cushion to the top cushion. Each ball should have a clear pot to a corner or centre pocket. Start simple: pot any ball in any order, counting how many you clear without a miss. For a harder challenge, alternate red → colour (re-spotted each time) to practise position play between shots.',
    bestPracticeTips:
      '- Use the same cue ball speed and contact point on every pot — this is a consistency drill, not a power drill.\n' +
      '- Re-rack and repeat at least 3 times per session, noting your best run each time.\n' +
      '- If you miss, reset your count to 0 rather than continuing — this builds the habit of expecting every pot to drop.',
    difficulty: 'beginner',
    suggestedDurationMins: 20,
    scoringType: 'count_potted',
    scoringTarget: 15,
    scoringUnit: 'balls',
    sortOrder: 1,
  }),
  exercise({
    slug: 'the-spider-safety-routine',
    name: 'Safety Positions Drill',
    category: 'safety',
    description:
      'Set up 10 different positions around the table — a red in a new location each time, cue ball placed at a realistic attacking or defensive distance. For each position, play a safety shot that either leaves the cue ball tight to a cushion, hides it behind a colour, or forces your opponent into a difficult long pot. Do not re-use the same position twice in one session.',
    bestPracticeTips:
      '- Always decide where you want the cue ball to finish before you look at the object ball — cue ball position is the purpose of the shot, not an afterthought.\n' +
      '- Pace is more important than spin on most safety shots; fine-tune speed first, then add side if needed.\n' +
      '- Score a shot successful only if your imaginary opponent would have no straightforward way back — a "safe" shot that leaves an easy long pot is a failed safety.',
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
      'Set up a full rack of reds with all colours on their spots and attempt to compile your highest possible break. The moment you miss or go in-off, the attempt ends — record your score and re-rack. Focus entirely on shot selection and cue ball position rather than rushing to pot the highest-value ball available.',
    bestPracticeTips:
      '- Always pot the red that gives you the best position on your next colour, not just the nearest or easiest red.\n' +
      '- When the table tightens up (reds near cushions or clustered), slow down and prioritise a safe visit over a forced pot.\n' +
      '- Log your break value even if you fail to clear — a regular 30 improving to a consistent 50 over weeks is real progress.',
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
      'Place the cue ball inside the D (baulk area) and pot the blue ball on its spot. On the first attempt, aim to make the cue ball stop dead on contact — this is the stun shot. On the second attempt, screw the cue ball back one ball-width. On the third, screw it back 30 cm. Continue adding distance until you can screw from the blue spot all the way to the baulk cushion. Advance to the next level only after three consecutive successes.',
    bestPracticeTips:
      '- Keep your cue level through impact for a clean stun — elevation causes the cue ball to "kick" unpredictably.\n' +
      '- For screw, address the cue ball lower than you think you need to, and accelerate smoothly through it — a jab or punch produces a wild result.\n' +
      '- Film your stance from the side occasionally; most players raise their cue on the backswing without realising it.',
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
      'Place a red on or near the pink spot (or any position three-quarters of the way up the table) and the cue ball at the baulk end of the table. Attempt a long diagonal pot into a corner pocket, return the cue ball to roughly the same starting position, and repeat 10 times. Then switch the angle — different starting position, same discipline of measuring consistency rather than individual success.',
    bestPracticeTips:
      '- Trust your pre-shot routine especially on long pots — give yourself an extra deliberate look at the contact point before you settle.\n' +
      '- A slightly longer bridge (10–15 cm) gives more stability over distance; make sure your bridge hand is flat and locked.\n' +
      '- Vary the angle after 10 consecutive attempts — most players have a strong side and a weak side on long pots.',
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
      'Place the cue ball on the brown spot (centre of the baulk line) and shoot it straight into the baulk cushion. Watch carefully whether the ball returns along exactly the same line or drifts to one side. Any drift reveals a misalignment in your stance, bridge, or cue action. Repeat 10 times, pausing after each to observe the return path before adjusting. Do this as the first drill of every session — it takes under five minutes and surfaces problems early.',
    bestPracticeTips:
      '- Watch your cue tip at the moment of contact — it must travel straight through, not veer left or right.\n' +
      '- If the ball consistently drifts the same way, check your stance first (feet position), then your bridge hand alignment.\n' +
      '- Place a coin or chalk on the cushion as an aiming target to keep your focus on a precise contact point.',
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
      'Place all six colours on their spots and scatter 4–6 reds around the table, each one positioned near a different colour. The rule: after potting each red, you must pot the colour closest to where that red was — not whichever colour scores highest. Colours re-spot as normal. This forces you to navigate the full table and practise getting position on every colour, not just the black. The drill ends when you miss, go in-off, or run out of reds.',
    bestPracticeTips:
      '- Plan at least two shots ahead: the colour you are potting now should set up an angle on the next red.\n' +
      '- Getting from one end of the table to the other between pairs is the real challenge — practise using the cushions to travel the cue ball.\n' +
      '- Try to beat your total score from the previous session; slow improvement is still improvement.',
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
      'Set up a simple pot anywhere on the table. Before each shot, declare a target zone out loud: "baulk cushion", "top cushion", or "centre of table". Pot the ball and try to bring the cue ball to rest in that zone using top spin, stun, screw, and varying pace. Replace the object ball and choose a new target zone for the next attempt.',
    bestPracticeTips:
      '- Commit to your target zone by speaking it aloud before you get down — this builds the habit of having a plan before every shot.\n' +
      '- Pace control matters as much as spin choice: right spin with wrong pace will still miss your zone by a metre.\n' +
      '- Use stun as your default and deviate from it only when the geometry requires follow or screw.',
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
      'Set up a full frame (or open table) and play out a complete visit, solo or against a practice partner. Impose a strict time limit per shot — 20 or 30 seconds is a good starting point — using a timer on your phone. When the buzzer sounds you must play the shot immediately. Log the best break you compile during the visit, plus a brief note on how the pressure affected your decision-making.',
    bestPracticeTips:
      '- Replicate your match pre-shot routine exactly, including any chalk and practice-stroke habits — pressure highlights any inconsistencies in your routine.\n' +
      '- If you notice yourself rushing, that is the habit to fix; slow down inside the time limit rather than playing faster.\n' +
      '- Reduce the time limit as you improve — serious players can and do play at 15 seconds per shot in practice.',
    difficulty: 'advanced',
    suggestedDurationMins: 45,
    scoringType: 'break_value',
    scoringTarget: null,
    scoringUnit: 'points',
    sortOrder: 9,
  }),
  exercise({
    slug: 'all-reds-safety-to-baulk',
    name: 'Last-Red Safety (Red to Baulk)',
    category: 'safety',
    description:
      'Simulate the final red on the table. Place a single red in the top half and the cue ball nearby. Your goal is to play the red down into baulk — ideally tight to the baulk cushion or nestled behind one of the baulk colours — while keeping the cue ball safe at the top of the table. This is the classic end-of-frame tactical exchange: sending the last red as far from the pockets as possible. Vary the starting positions each attempt.',
    bestPracticeTips:
      '- Pace is everything — a thin contact at medium pace sends the red further than a thicker hit; experiment with different amounts of ball.\n' +
      '- Try to leave the red tight on or near the baulk cushion, ideally behind one of the baulk colours so your opponent has no easy pot.\n' +
      '- Think about where the cue ball finishes too — the best outcome is the red in baulk AND the cue ball at the opposite end of the table.',
    difficulty: 'intermediate',
    suggestedDurationMins: 15,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'safeties',
    sortOrder: 10,
  }),
  exercise({
    slug: 'cushion-first-drill',
    name: 'One-Cushion Escape Drill',
    category: 'potting',
    description:
      'Place a red on one side of the table and the cue ball on the other, with an obstacle ball blocking the direct path. Because you cannot pot or hit the red directly, you must play a one-cushion escape — sending the cue ball into a side cushion so it comes off at an angle to reach the red. Start with short, simple escapes where the angle is obvious, and progressively work toward longer cushion-first shots. Repeat 10 times per session, varying the positions each time.',
    bestPracticeTips:
      '- Fix your pace on a single angle before varying it — cushion-first shots are extremely sensitive to cue ball speed.\n' +
      '- Visualise the angle off the cushion by imagining a mirror: the cue ball leaves the rail at roughly the same angle it arrived.\n' +
      '- Start with the obstacle close to the cue ball so the escape angle is gentle, and gradually increase the difficulty only once you\'re consistently finding the red.',
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
      'Scatter all 15 reds randomly across the table — no deliberate setup, just a loose spread. Then try to clear every one. Pick off whichever red looks most potable first; there is no compulsory order. The aim is to get your eye in and build rhythm, not to practice position play. When you miss, count how many you cleared and try to beat that number next time.',
    bestPracticeTips:
      "- Don't overthink position early on — this is a rhythm and eye warm-up, not a break-building session.\n" +
      '- If a red looks risky or awkward, leave it and come back once the table opens up.\n' +
      '- Keep a running count — noticing steady improvement (e.g. clearing 9 one week, 11 the next) is one of the best motivators in practice.',
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
      'Place all six colours on their spots and pot them in any order you choose, re-spotting each ball immediately after it is potted. There is no red between colours — just pure colour-to-colour potting all over the table. Once comfortable with a free-choice order, try potting them in ascending value (yellow→green→brown→blue→pink→black) and then in descending order. Add a timer once the basic drill feels easy.',
    bestPracticeTips:
      "- Vary the order each session so you are covering different angles and pocket combinations — it is easy to fall into a routine that avoids your weaker pockets.\n" +
      '- After each miss, re-spot and note why you missed: was it alignment, pace, or cueing through the shot?\n' +
      '- Once comfortable, time yourself and try to beat your best time — adds a small but useful pressure element.',
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
      'Place 5–8 reds loosely around the top end of the table (within about a metre of the top cushion) and pot them one by one, replacing the cue ball near the previous position after each pot. There is no pressure to pot them all in sequence — this is purely about finding a relaxed, flowing stroke before moving into structured practice. Take your time on the bridge and address; resist the urge to rush.',
    bestPracticeTips:
      '- Keep a deliberately slow rhythm — this drill is for loosening tension in your grip and bridge, not for speed.\n' +
      '- Notice any consistent early misses; they often point to something to check in your stance or alignment before the session.\n' +
      '- A couple of minutes is enough — the moment you feel comfortable and strokes are flowing, move on to a structured drill.',
    difficulty: 'beginner',
    suggestedDurationMins: 5,
    scoringType: 'count_potted',
    scoringTarget: 10,
    scoringUnit: 'balls',
    sortOrder: 14,
  }),

  // --- Rest & Spider ---
  exercise({
    slug: 'rest-potting-drill',
    name: 'Rest Potting Drill',
    category: 'cueing_fundamentals',
    description:
      'Place the cue ball very close to the baulk cushion so it can only be reached with the standard rest. Arrange 8 object balls at staggered positions across the table — varying distances (short, medium, long) and a range of angles. Work through each ball using the rest, focusing on a smooth, level delivery and controlled pace. Resist the temptation to use the wrong end of the cue instead.',
    bestPracticeTips:
      '- Grip the rest shaft firmly enough that the rest head does not wobble, but do not white-knuckle it — unnecessary tension ruins your stroke.\n' +
      '- Shorten your backswing when using the rest: most rest misses come from over-hitting rather than inaccurate aim.\n' +
      '- Start with a straight pot at medium distance to find your rhythm, then move to angled and longer shots.\n' +
      '- The most common mistake is trying to add heavy side or screw with the rest — concentrate on a clean, straight contact first.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'count_potted',
    scoringTarget: 8,
    scoringUnit: 'balls',
    sortOrder: 15,
  }),
  exercise({
    slug: 'spider-potting-drill',
    name: 'Spider Potting Drill',
    category: 'cueing_fundamentals',
    description:
      'The spider is needed when balls are clustered between you and the cue ball, making both a normal bridge and the standard rest impossible (the rest head would collide with the blocking balls). Place the cue ball in the middle of the table and scatter 3–4 reds between it and the baulk end; the spider bridges over those reds so you can reach the cue ball. Set up 8 such positions, varying how many balls you must bridge over and the distance to the object ball.',
    bestPracticeTips:
      '- Lower the spider head onto the blocking balls gently so it sits still before you get down — any movement in the bridge destroys your aim.\n' +
      '- Use noticeably less backswing than normal: you cannot follow through naturally with the spider so the stroke must be clean and compact.\n' +
      '- Keep both eyes focused on the contact point on the object ball — your cue tip is hidden behind the raised bridge head so your visual alignment carries extra responsibility.\n' +
      '- Start with one blocking ball and a straight pot; add more blocking balls and angle only once you are comfortable with the basic delivery.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'count_potted',
    scoringTarget: 8,
    scoringUnit: 'balls',
    sortOrder: 16,
  }),

  // --- Positional play ---
  exercise({
    slug: 'two-shot-position-drill',
    name: 'Two-Shot Position Drill',
    category: 'positional_play',
    description:
      'Before each shot, declare a specific target zone for the cue ball — for example, "inside the D", "within a cue-length of the blue spot", or "right-hand baulk quarter". Then pot a simple ball and score yourself a point only if BOTH conditions are met: the pot drops AND the cue ball lands inside the declared zone. If you pot the ball but miss the zone, no point. Reset the object ball and declare a new zone for the next attempt.',
    bestPracticeTips:
      '- Speak your target zone out loud before you get down on the shot — the commitment step is essential to train positional planning.\n' +
      '- Pace is the primary control variable: the right spin with the wrong pace still misses the zone by a metre.\n' +
      '- For zones on the far side of the table, think about the route (how many cushions, which side) before thinking about spin.\n' +
      '- Start with large, easy zones and shrink them as your cue ball control improves.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'points',
    sortOrder: 17,
  }),
  exercise({
    slug: 'side-cushion-position',
    name: 'Side Cushion Position Drill',
    category: 'positional_play',
    description:
      'Place object balls in pairs at opposite ends of the table — pot the first ball and use the natural angle off a side (long) cushion to roll into position on the second. Vary the starting angle and distance each attempt. The side cushion route is often the shortest, most controlled path to the next ball, but most players default to top or bottom cushions and neglect it entirely.',
    bestPracticeTips:
      '- The natural angle (thin cut, no side spin) usually sends the cue ball toward the side cushion without much effort; use this as your starting technique and adjust from there.\n' +
      '- Adding side spin changes where the cue ball "bites" into the cushion and the angle it leaves on — experiment, but with small amounts first.\n' +
      '- Practice both the left and right side cushion routes in equal measure — almost all players have one side they avoid.\n' +
      '- If the cue ball consistently overshoots after the cushion, reduce pace rather than adding check side.',
    difficulty: 'intermediate',
    suggestedDurationMins: 20,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'positions',
    sortOrder: 18,
  }),
  exercise({
    slug: 'red-black-combination',
    name: 'Red-Black Combination',
    category: 'positional_play',
    description:
      'Place the black on its spot and a red anywhere in the top half of the table. Pot the red into a corner pocket, aiming to land the cue ball on the black for an easy pot — ideally just off straight so you have a natural angle onto the next red. Reset to a new red position each attempt. This is the single most-practiced unit of break-building and the foundation of every professional\'s potting game.',
    bestPracticeTips:
      '- The natural angle off many red cuts already carries the cue ball toward the black — identify whether you need spin at all before defaulting to heavy side.\n' +
      '- Running side spin (same direction as the pocket you\'re potting into) widens the cue ball angle; use it when the natural route leaves you short of the black.\n' +
      '- If the natural angle is tight, try sending the cue ball off the top cushion to bounce down toward the black — practice this specific route until it feels reliable.\n' +
      '- You want to finish just off straight on the black — dead straight leaves you no angle for position on the next red.',
    difficulty: 'intermediate',
    suggestedDurationMins: 15,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'positions',
    sortOrder: 19,
  }),
  exercise({
    slug: 'snooker-behind-baulk-colours',
    name: 'Laying Snookers (Baulk Colours)',
    category: 'safety',
    description:
      'Place the cue ball in the top half of the table and a single red near the baulk end. Your aim is to play a safety that leaves the cue ball hidden behind one of the three baulk colours (yellow, green, or brown) so your opponent cannot hit the red in a straight line. Before each shot, choose which baulk colour you intend to snooker behind, then judge whether you achieved it. Score a point only if the cue ball is fully hidden (a full snooker, not just a partial obstruction).',
    bestPracticeTips:
      '- Soft pace is usually better — it is much easier to judge where the cue ball will stop at slow speed.\n' +
      '- Brown is the easiest colour to hide behind because it sits in the middle of the baulk line; start there before attempting yellow or green.\n' +
      '- If you cannot get a full snooker, leaving the cue ball tight to the baulk colour is still excellent — even a partial obstruction forces a difficult shot.',
    difficulty: 'intermediate',
    suggestedDurationMins: 15,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'snookers',
    sortOrder: 20,
  }),
  exercise({
    slug: 'snooker-behind-black-pink',
    name: 'Laying Snookers (Black & Pink)',
    category: 'safety',
    description:
      'Place the cue ball in the baulk half and a red near a side cushion in the top half of the table. Play a safety that brings the cue ball up the table and tucks it behind the black or the pink on their spots. These snookers are harder to lay because the cue ball must travel further, but they are extremely effective in match play — your opponent often cannot even see the red. Alternate between targeting the black and the pink. Score a point only for a full snooker.',
    bestPracticeTips:
      '- Use the natural angle off the cushion to guide the cue ball behind the colour — a cushion-first approach is often more controllable than a direct roll.\n' +
      '- Getting the cue ball to stop in the right place is all about pace; once you find the right weight for one position, repeat it several times to lock in the feel.\n' +
      '- In a match, even if the snooker isn\'t perfect, leaving the cue ball near the black or pink forces your opponent into a very long and difficult pot — that\'s still a win.',
    difficulty: 'advanced',
    suggestedDurationMins: 15,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: 'snookers',
    sortOrder: 21,
  }),
];
