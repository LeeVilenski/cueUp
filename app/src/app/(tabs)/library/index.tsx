import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function LibraryScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Library</ThemedText>
      <ThemedText themeColor="textSecondary">Exercises and best-practice tips — coming soon.</ThemedText>
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
