import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/lib/date-format';
import { useMatch } from '@/lib/hooks/use-matches';
import { MATCH_RESULT_LABELS } from '@/lib/match-format';
import { deleteMatch } from '@/lib/matches';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { match, frames, loading } = useMatch(id);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!match) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Match not found.</ThemedText>
      </ThemedView>
    );
  }

  const resultColor = { win: theme.tint, loss: theme.danger, draw: theme.textSecondary }[match.result];

  const handleDelete = async () => {
    setDeleting(true);
    await deleteMatch(match.id);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{match.opponentName}</ThemedText>
          <View style={[styles.resultBadge, { backgroundColor: resultColor }]}>
            <ThemedText type="smallBold" style={{ color: theme.tintText }}>
              {MATCH_RESULT_LABELS[match.result]}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          {formatDate(match.playedAt)}
          {match.isLeague ? ' · League' : ''}
        </ThemedText>

        {match.framesWon != null && match.framesLost != null ? (
          <Card>
            <ThemedText type="smallBold">Match score</ThemedText>
            <ThemedText type="title">
              {match.framesWon}–{match.framesLost}
            </ThemedText>
          </Card>
        ) : null}

        {frames.length > 0 ? (
          <Card>
            <ThemedText type="smallBold">Frame-by-frame</ThemedText>
            {frames.map((frame) => (
              <View key={frame.id} style={styles.frameRow}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.frameNumber}>
                  Frame {frame.frameNumber}
                </ThemedText>
                <ThemedText type="default" style={styles.frameScore}>
                  {frame.playerScore}–{frame.opponentScore}
                </ThemedText>
                <View style={styles.frameBreaks}>
                  {frame.playerHighBreak != null ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      You: {frame.playerHighBreak}
                    </ThemedText>
                  ) : null}
                  {frame.opponentHighBreak != null ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      Opp: {frame.opponentHighBreak}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
            ))}
          </Card>
        ) : null}

        {match.notes ? (
          <Card>
            <ThemedText type="smallBold">Notes</ThemedText>
            <ThemedText>{match.notes}</ThemedText>
          </Card>
        ) : null}

        <Button label="Delete match" variant="secondary" onPress={handleDelete} loading={deleting} fullWidth />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  resultBadge: {
    borderRadius: 999,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  frameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  frameNumber: {
    width: 64,
  },
  frameScore: {
    width: 64,
  },
  frameBreaks: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.three,
  },
});
