import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type NumericStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function NumericStepper({ value, onChange, min = 0, max, step = 1 }: NumericStepperProps) {
  const theme = useTheme();

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(max != null ? Math.min(max, value + step) : value + step);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        onPress={decrement}
        disabled={value <= min}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.backgroundElement },
          (pressed || value <= min) && styles.pressed,
        ]}>
        <ThemedText type="title" style={styles.buttonLabel}>
          −
        </ThemedText>
      </Pressable>

      <ThemedText type="title" style={styles.value}>
        {value}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        onPress={increment}
        disabled={max != null && value >= max}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.backgroundElement },
          (pressed || (max != null && value >= max)) && styles.pressed,
        ]}>
        <ThemedText type="title" style={styles.buttonLabel}>
          +
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 28,
    lineHeight: 32,
  },
  value: {
    minWidth: 64,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});
