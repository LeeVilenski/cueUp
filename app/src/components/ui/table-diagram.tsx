import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';

/**
 * Coordinate system (matches looking down at the table in landscape):
 *   x: 0 = baulk cushion end, 1 = top cushion end
 *   y: 0 = top rail, 1 = bottom rail
 */

export type DiagramBallType = 'white' | 'red' | 'yellow' | 'green' | 'brown' | 'blue' | 'pink' | 'black';

export type DiagramBall = {
  x: number;
  y: number;
  type: DiagramBallType;
};

export type DiagramZone = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
};

export type DiagramSpec = {
  balls: DiagramBall[];
  zones?: DiagramZone[];
  note?: string;
};

const BALL_STYLES: Record<DiagramBallType, { fill: string; border: string }> = {
  white: { fill: '#f0f0f0', border: '#aaaaaa' },
  red: { fill: '#dd2020', border: '#990000' },
  yellow: { fill: '#e6d000', border: '#b8a000' },
  green: { fill: '#228b22', border: '#155515' },
  brown: { fill: '#8b4513', border: '#5c2d00' },
  blue: { fill: '#1040cc', border: '#0a2888' },
  pink: { fill: '#e880b0', border: '#c050a0' },
  black: { fill: '#1a1a1a', border: '#000000' },
};

const SPOT_POSITIONS = [
  { x: 0.2, y: 0.3 },
  { x: 0.2, y: 0.5 },
  { x: 0.2, y: 0.7 },
  { x: 0.5, y: 0.5 },
  { x: 0.75, y: 0.5 },
  { x: 0.9, y: 0.5 },
];

const POCKET_POSITIONS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 0.5, y: 0 },
  { x: 0.5, y: 1 },
];

const BALL_SIZE = 14;
const POCKET_SIZE = 14;
const SPOT_SIZE = 3;

export function TableDiagram({ balls, zones, note }: DiagramSpec) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.cushionFrame}>
        <View style={styles.felt}>
          {/* Baulk line */}
          <View style={styles.baulkLine} />

          {/* Spot markers */}
          {SPOT_POSITIONS.map((spot, i) => (
            <View
              key={i}
              style={[styles.spot, { left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }]}
            />
          ))}

          {/* Pockets */}
          {POCKET_POSITIONS.map((pocket, i) => (
            <View
              key={i}
              style={[
                styles.pocket,
                { left: `${pocket.x * 100}%`, top: `${pocket.y * 100}%` },
              ]}
            />
          ))}

          {/* Target zones */}
          {zones?.map((zone, i) => (
            <View
              key={i}
              style={[
                styles.zone,
                {
                  left: `${(zone.x - zone.w / 2) * 100}%`,
                  top: `${(zone.y - zone.h / 2) * 100}%`,
                  width: `${zone.w * 100}%`,
                  height: `${zone.h * 100}%`,
                  backgroundColor: zone.color,
                },
              ]}
            />
          ))}

          {/* Balls */}
          {balls.map((ball, i) => (
            <View
              key={i}
              style={[
                styles.ball,
                {
                  left: `${ball.x * 100}%`,
                  top: `${ball.y * 100}%`,
                  backgroundColor: BALL_STYLES[ball.type].fill,
                  borderColor: BALL_STYLES[ball.type].border,
                },
              ]}>
              {ball.type === 'white' && <View style={styles.cueBallDot} />}
            </View>
          ))}
        </View>
      </View>

      {note ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          {note}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  cushionFrame: {
    backgroundColor: '#145228',
    borderRadius: Radius.medium,
    padding: 6,
  },
  felt: {
    backgroundColor: '#1e7a3a',
    aspectRatio: 2,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 2,
  },
  baulkLine: {
    position: 'absolute',
    left: '20%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  spot: {
    position: 'absolute',
    width: SPOT_SIZE,
    height: SPOT_SIZE,
    borderRadius: SPOT_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginLeft: -(SPOT_SIZE / 2),
    marginTop: -(SPOT_SIZE / 2),
  },
  pocket: {
    position: 'absolute',
    width: POCKET_SIZE,
    height: POCKET_SIZE,
    borderRadius: POCKET_SIZE / 2,
    backgroundColor: '#0a0a0a',
    marginLeft: -(POCKET_SIZE / 2),
    marginTop: -(POCKET_SIZE / 2),
  },
  zone: {
    position: 'absolute',
    borderRadius: 2,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    borderWidth: 1.5,
    marginLeft: -(BALL_SIZE / 2),
    marginTop: -(BALL_SIZE / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cueBallDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
