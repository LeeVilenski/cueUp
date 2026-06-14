import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { type BreakLog } from '@/db/schema';
import { BREAK_CONTEXT_LABELS } from '@/lib/break-format';
import { deleteBreakLog } from '@/lib/break-logs';
import { formatDate } from '@/lib/date-format';
import { useBreakLogs } from '@/lib/hooks/use-break-logs';
import { useTheme } from '@/hooks/use-theme';

export default function BreakHistoryScreen() {
  const { breakLogs, loading, refresh } = useBreakLogs();

  const handleDelete = async (id: string) => {
    await deleteBreakLog(id);
    await refresh();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {!loading && breakLogs.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            No breaks logged yet. Tap &quot;Log a break&quot; from Home to record your first one.
          </ThemedText>
        ) : (
          <FlatList
            data={breakLogs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <BreakLogRow item={item} onDelete={() => handleDelete(item.id)} />}
          />
        )}
      </View>
    </ThemedView>
  );
}

function BreakLogRow({ item, onDelete }: { item: BreakLog; onDelete: () => void }) {
  const theme = useTheme();

  return (
    <Card style={styles.row}>
      <View
        style={[
          styles.scoreBadge,
          { backgroundColor: item.isPersonalBest ? theme.tint : theme.backgroundSelected },
        ]}>
        <ThemedText type="smallBold" style={{ color: item.isPersonalBest ? theme.tintText : theme.text }}>
          {item.score}
        </ThemedText>
      </View>

      <View style={styles.rowText}>
        <View style={styles.rowHeader}>
          <ThemedText type="default">{BREAK_CONTEXT_LABELS[item.context]}</ThemedText>
          {item.isPersonalBest ? (
            <ThemedText type="small" themeColor="tint">
              Personal best
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDate(item.achievedAt)}
        </ThemedText>
        {item.notes ? (
          <ThemedText type="small" themeColor="textSecondary">
            {item.notes}
          </ThemedText>
        ) : null}
      </View>

      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete break log"
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
  scoreBadge: {
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
