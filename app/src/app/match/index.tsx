import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { type Match } from '@/db/schema';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/lib/date-format';
import { useMatches } from '@/lib/hooks/use-matches';
import { MATCH_RESULT_LABELS } from '@/lib/match-format';
import { deleteMatch } from '@/lib/matches';

export default function MatchHistoryScreen() {
  const router = useRouter();
  const { matches, loading, refresh } = useMatches();

  const handleDelete = async (id: string) => {
    await deleteMatch(id);
    await refresh();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {!loading && matches.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            No matches logged yet. Tap &quot;Log a match&quot; from Home to record your first one.
          </ThemedText>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <MatchRow
                item={item}
                onPress={() => router.push(`/match/${item.id}`)}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        )}
      </View>
    </ThemedView>
  );
}

function MatchRow({ item, onPress, onDelete }: { item: Match; onPress: () => void; onDelete: () => void }) {
  const theme = useTheme();

  const resultColor = { win: theme.tint, loss: theme.danger, draw: theme.textSecondary }[item.result];

  return (
    <Card style={styles.row}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View match against ${item.opponentName}`}
        style={({ pressed }) => [styles.rowContent, pressed && styles.pressed]}>
        <View style={[styles.resultBadge, { backgroundColor: resultColor }]}>
          <ThemedText type="smallBold" style={{ color: theme.tintText }}>
            {MATCH_RESULT_LABELS[item.result].charAt(0)}
          </ThemedText>
        </View>

        <View style={styles.rowText}>
          <View style={styles.rowHeader}>
            <ThemedText type="default">{item.opponentName}</ThemedText>
            {item.isLeague ? (
              <ThemedText type="small" themeColor="tint">
                League
              </ThemedText>
            ) : null}
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(item.playedAt)}
            {item.framesWon != null && item.framesLost != null ? ` · ${item.framesWon}–${item.framesLost}` : ''}
          </ThemedText>
        </View>
      </Pressable>

      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Delete match against ${item.opponentName}`}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
        <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.five,
  },
  empty: {
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  resultBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: Spacing.half,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  deleteButton: {
    padding: Spacing.two,
  },
  pressed: {
    opacity: 0.6,
  },
});
