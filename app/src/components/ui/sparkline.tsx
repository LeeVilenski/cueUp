import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Sparkline({ values, color }: { values: number[]; color?: string }) {
  const theme = useTheme();
  const max = Math.max(...values, 1);
  const barColor = color ?? theme.tint;

  return (
    <View style={styles.row}>
      {values.map((value, index) => (
        <View key={index} style={styles.barTrack}>
          <View
            style={[
              styles.bar,
              { height: `${Math.max((value / max) * 100, 6)}%`, backgroundColor: barColor },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
    height: 48,
  },
  barTrack: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: Radius.small,
    minHeight: 4,
  },
});
