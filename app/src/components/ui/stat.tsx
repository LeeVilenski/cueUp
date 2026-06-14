import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type StatProps = ViewProps & {
  label: string;
  value: string;
  accentColor?: string;
};

export function Stat({ label, value, accentColor, style, ...rest }: StatProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      <ThemedText type="title" style={[styles.value, accentColor ? { color: accentColor } : undefined]}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.half,
    minWidth: 96,
  },
  value: {
    fontSize: 32,
    lineHeight: 36,
  },
});
