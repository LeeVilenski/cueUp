import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function NewSessionScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Start a session</ThemedText>
      <ThemedText themeColor="textSecondary">Quick start or pick a routine — coming soon.</ThemedText>
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
