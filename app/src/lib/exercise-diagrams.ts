import type { DiagramSpec } from '@/components/ui/table-diagram';

export const EXERCISE_DIAGRAMS: Record<string, DiagramSpec> = {
  'line-up-15-reds': {
    balls: [
      { x: 0.08, y: 0.5, type: 'red' },
      { x: 0.19, y: 0.5, type: 'red' },
      { x: 0.3, y: 0.5, type: 'red' },
      { x: 0.41, y: 0.5, type: 'red' },
      { x: 0.52, y: 0.5, type: 'red' },
      { x: 0.63, y: 0.5, type: 'red' },
      { x: 0.74, y: 0.5, type: 'red' },
      { x: 0.85, y: 0.5, type: 'red' },
      { x: 0.96, y: 0.5, type: 'red' },
      { x: 0.08, y: 0.25, type: 'white' },
    ],
    note: 'All 15 reds in a line down the centre of the table, from baulk to top cushion. Pot into any pocket.',
  },

  'the-spider-safety-routine': {
    balls: [
      { x: 0.75, y: 0.2, type: 'red' },
      { x: 0.35, y: 0.5, type: 'white' },
    ],
    zones: [{ x: 0.1, y: 0.5, w: 0.2, h: 0.95, color: 'rgba(64,200,240,0.2)' }],
    note: 'Example safety position. Aim to finish the cue ball in the baulk zone (blue) after every safety shot.',
  },

  'century-break-practice': {
    balls: [
      { x: 0.2, y: 0.3, type: 'green' },
      { x: 0.2, y: 0.5, type: 'brown' },
      { x: 0.2, y: 0.7, type: 'yellow' },
      { x: 0.5, y: 0.5, type: 'blue' },
      { x: 0.75, y: 0.5, type: 'pink' },
      { x: 0.9, y: 0.5, type: 'black' },
      { x: 0.78, y: 0.35, type: 'red' },
      { x: 0.82, y: 0.45, type: 'red' },
      { x: 0.78, y: 0.55, type: 'red' },
      { x: 0.82, y: 0.65, type: 'red' },
      { x: 0.72, y: 0.5, type: 'red' },
      { x: 0.86, y: 0.38, type: 'red' },
      { x: 0.36, y: 0.42, type: 'white' },
    ],
    note: 'Colours on their spots; reds in triangle near the pink. Build the highest break you can.',
  },

  'stun-and-screw-control-ladder': {
    balls: [
      { x: 0.5, y: 0.5, type: 'blue' },
      { x: 0.22, y: 0.5, type: 'white' },
    ],
    note: 'Pot the blue: first stun (stop dead), then screw back progressively further on each attempt. Move up one level only when you succeed three times.',
  },

  'long-pot-consistency-drill': {
    balls: [
      { x: 0.85, y: 0.3, type: 'red' },
      { x: 0.12, y: 0.68, type: 'white' },
    ],
    note: 'Long diagonal pot from the baulk end to the top-right corner pocket. Return cue ball to roughly the same starting position after each pot.',
  },

  'pendulum-straight-cue-drill': {
    balls: [{ x: 0.2, y: 0.5, type: 'white' }],
    note: 'Cue ball on the brown spot (centre of the baulk line). Shoot straight into the baulk cushion — the ball must return along the exact same line.',
  },

  'pairs-colours-break-building': {
    balls: [
      { x: 0.15, y: 0.5, type: 'white' },
      { x: 0.2, y: 0.3, type: 'green' },
      { x: 0.2, y: 0.5, type: 'brown' },
      { x: 0.2, y: 0.7, type: 'yellow' },
      { x: 0.5, y: 0.5, type: 'blue' },
      { x: 0.75, y: 0.5, type: 'pink' },
      { x: 0.9, y: 0.5, type: 'black' },
      { x: 0.25, y: 0.35, type: 'red' },
      { x: 0.45, y: 0.62, type: 'red' },
      { x: 0.7, y: 0.32, type: 'red' },
      { x: 0.85, y: 0.65, type: 'red' },
    ],
    note: 'Colours on their spots, reds scattered near different colours. After each red, pot the colour nearest to where that red was — not always the black.',
  },

  'top-bottom-cushion-control': {
    balls: [
      { x: 0.45, y: 0.5, type: 'red' },
      { x: 0.25, y: 0.5, type: 'white' },
    ],
    zones: [
      { x: 0.1, y: 0.5, w: 0.2, h: 0.75, color: 'rgba(64,200,240,0.2)' },
      { x: 0.95, y: 0.5, w: 0.1, h: 0.75, color: 'rgba(255,180,50,0.2)' },
    ],
    note: 'Before each shot declare a target zone — baulk (blue), top cushion (orange), or centre. Score only if the cue ball lands in the declared zone.',
  },

  'match-simulation-vs-clock': {
    balls: [
      { x: 0.2, y: 0.3, type: 'green' },
      { x: 0.2, y: 0.5, type: 'brown' },
      { x: 0.2, y: 0.7, type: 'yellow' },
      { x: 0.5, y: 0.5, type: 'blue' },
      { x: 0.75, y: 0.5, type: 'pink' },
      { x: 0.9, y: 0.5, type: 'black' },
      { x: 0.78, y: 0.4, type: 'red' },
      { x: 0.82, y: 0.5, type: 'red' },
      { x: 0.78, y: 0.6, type: 'red' },
      { x: 0.72, y: 0.48, type: 'red' },
      { x: 0.86, y: 0.42, type: 'red' },
      { x: 0.38, y: 0.48, type: 'white' },
    ],
    note: 'Full-table setup — play each shot within a fixed time limit to simulate real match pressure.',
  },

  'all-reds-safety-to-baulk': {
    balls: [
      { x: 0.7, y: 0.35, type: 'red' },
      { x: 0.6, y: 0.55, type: 'white' },
      { x: 0.2, y: 0.3, type: 'green' },
      { x: 0.2, y: 0.5, type: 'brown' },
      { x: 0.2, y: 0.7, type: 'yellow' },
    ],
    zones: [{ x: 0.1, y: 0.5, w: 0.2, h: 0.95, color: 'rgba(64,200,240,0.2)' }],
    note: 'Last-red scenario. Play the red down into the baulk zone (blue), ideally behind a baulk colour. Keep the cue ball safe at the top end.',
  },

  'cushion-first-drill': {
    balls: [
      { x: 0.45, y: 0.38, type: 'red' },
      { x: 0.32, y: 0.5, type: 'blue' },
      { x: 0.2, y: 0.65, type: 'white' },
    ],
    note: 'The blue blocks the direct path to the red. Play a one-cushion escape — send the white into the side cushion to reach the red.',
  },

  'scatter-and-clear-15-reds': {
    balls: [
      { x: 0.25, y: 0.32, type: 'red' },
      { x: 0.42, y: 0.68, type: 'red' },
      { x: 0.55, y: 0.22, type: 'red' },
      { x: 0.62, y: 0.72, type: 'red' },
      { x: 0.7, y: 0.42, type: 'red' },
      { x: 0.8, y: 0.18, type: 'red' },
      { x: 0.35, y: 0.52, type: 'red' },
      { x: 0.5, y: 0.58, type: 'red' },
      { x: 0.15, y: 0.78, type: 'red' },
      { x: 0.3, y: 0.42, type: 'white' },
    ],
    note: 'Reds scattered at random. Pick off the easiest pot first and work through the pack. Count how many you clear before a miss.',
  },

  'clear-the-colours': {
    balls: [
      { x: 0.2, y: 0.3, type: 'green' },
      { x: 0.2, y: 0.5, type: 'brown' },
      { x: 0.2, y: 0.7, type: 'yellow' },
      { x: 0.5, y: 0.5, type: 'blue' },
      { x: 0.75, y: 0.5, type: 'pink' },
      { x: 0.9, y: 0.5, type: 'black' },
      { x: 0.38, y: 0.35, type: 'white' },
    ],
    note: 'All six colours on their spots. Pot them in any order (re-spot each one). Once comfortable, time your run.',
  },

  'top-pocket-loosener': {
    balls: [
      { x: 0.85, y: 0.22, type: 'red' },
      { x: 0.9, y: 0.42, type: 'red' },
      { x: 0.85, y: 0.6, type: 'red' },
      { x: 0.92, y: 0.72, type: 'red' },
      { x: 0.78, y: 0.82, type: 'red' },
      { x: 0.65, y: 0.5, type: 'white' },
    ],
    note: 'Reds near the top end. Pot each with a relaxed, smooth stroke — focus on rhythm and feel, not result.',
  },

  'rest-potting-drill': {
    balls: [
      { x: 0.06, y: 0.5, type: 'white' },
      { x: 0.38, y: 0.5, type: 'red' },
      { x: 0.52, y: 0.35, type: 'red' },
      { x: 0.65, y: 0.5, type: 'red' },
      { x: 0.78, y: 0.65, type: 'red' },
    ],
    note: 'Cue ball close to the baulk cushion — use the standard rest. Work through balls at staggered distances and angles.',
  },

  'spider-potting-drill': {
    balls: [
      { x: 0.58, y: 0.45, type: 'white' },
      { x: 0.46, y: 0.38, type: 'red' },
      { x: 0.44, y: 0.52, type: 'red' },
      { x: 0.5, y: 0.62, type: 'red' },
      { x: 0.82, y: 0.32, type: 'red' },
    ],
    note: 'Reds between you and the cue ball block the rest head. Use the spider to bridge over them and reach the cue ball.',
  },

  'two-shot-position-drill': {
    balls: [
      { x: 0.55, y: 0.45, type: 'red' },
      { x: 0.3, y: 0.3, type: 'white' },
    ],
    zones: [{ x: 0.5, y: 0.5, w: 0.22, h: 0.35, color: 'rgba(255,220,0,0.3)' }],
    note: 'Declare your cue ball target zone (e.g. the yellow area) before each shot. A point is scored only if you pot the ball AND land in the zone.',
  },

  'side-cushion-position': {
    balls: [
      { x: 0.55, y: 0.38, type: 'red' },
      { x: 0.3, y: 0.28, type: 'red' },
      { x: 0.45, y: 0.68, type: 'white' },
    ],
    note: 'Pot the first red; use the natural side-cushion angle to position on the second red. Practice both rails — most players have a weaker side.',
  },

  'red-black-combination': {
    balls: [
      { x: 0.82, y: 0.35, type: 'red' },
      { x: 0.9, y: 0.5, type: 'black' },
      { x: 0.62, y: 0.5, type: 'white' },
    ],
    note: 'Pot the red into a corner pocket and land on the black — just off straight for an easy pot with a natural angle. Vary the red\'s position each attempt.',
  },

  'snooker-behind-baulk-colours': {
    balls: [
      { x: 0.65, y: 0.4, type: 'white' },
      { x: 0.15, y: 0.65, type: 'red' },
      { x: 0.2, y: 0.3, type: 'green' },
      { x: 0.2, y: 0.5, type: 'brown' },
      { x: 0.2, y: 0.7, type: 'yellow' },
    ],
    note: 'Play a safety that hides the cue ball behind a baulk colour (yellow, green, or brown) so the red cannot be hit directly.',
  },

  'snooker-behind-black-pink': {
    balls: [
      { x: 0.25, y: 0.4, type: 'white' },
      { x: 0.7, y: 0.2, type: 'red' },
      { x: 0.75, y: 0.5, type: 'pink' },
      { x: 0.9, y: 0.5, type: 'black' },
    ],
    note: 'Send the cue ball up the table and tuck it behind the pink or the black so your opponent cannot see the red.',
  },
};
