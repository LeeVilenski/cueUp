import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function NewBreakLogScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Log a break</ThemedText>
      <ThemedText themeColor="textSecondary">Quick score entry — coming soon.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
});
