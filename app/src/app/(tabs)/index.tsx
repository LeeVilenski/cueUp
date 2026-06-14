import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Snooker Coach</ThemedText>
      <ThemedText themeColor="textSecondary">Home dashboard — coming soon.</ThemedText>

      <Link href="/session/new" style={styles.link}>
        <ThemedText type="linkPrimary">Start a session</ThemedText>
      </Link>
      <Link href="/break-log/new" style={styles.link}>
        <ThemedText type="linkPrimary">Log a break</ThemedText>
      </Link>
      <Link href="/break-log" style={styles.link}>
        <ThemedText type="linkPrimary">View break history</ThemedText>
      </Link>
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
  link: {
    marginTop: Spacing.two,
  },
});
