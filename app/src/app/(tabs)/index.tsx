import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/lib/date-format';
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats';
import { MOOD_EMOJI } from '@/lib/mood-format';
import { startSession } from '@/lib/sessions';

const RECENT_SESSIONS_LIMIT = 3;

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [startingSuggested, setStartingSuggested] = useState(false);

  const { sessions, activeSession, personalBests, streaks, weeklyCount, weeklyGoal, exerciseNameById, suggestedRoutine } =
    useDashboardStats();

  const handleStartSuggested = async () => {
    setStartingSuggested(true);
    const sessionId = await startSession();
    router.push(`/session/${sessionId}/active?exercises=${suggestedRoutine.exerciseIds.join(',')}`);
  };

  const recentSessions = sessions.filter((session) => session.id !== activeSession?.id).slice(0, RECENT_SESSIONS_LIMIT);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Snooker Coach</ThemedText>

        {activeSession ? (
          <Card style={styles.resumeCard}>
            <View style={styles.sessionInfo}>
              <ThemedText type="default">Session in progress</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Started {formatDate(activeSession.startedAt)}
              </ThemedText>
            </View>
            <Button
              label="Resume"
              variant="secondary"
              onPress={() => router.push(`/session/${activeSession.id}/active`)}
            />
          </Card>
        ) : null}

        <View style={styles.actionsRow}>
          <View style={styles.actionButton}>
            <Button label="Start a session" onPress={() => router.push('/session/new')} fullWidth />
          </View>
          <View style={styles.actionButton}>
            <Button label="Log a break" variant="secondary" onPress={() => router.push('/break-log/new')} fullWidth />
          </View>
        </View>

        <Card style={styles.statsGrid}>
          <Stat
            label="Personal best"
            value={personalBests.overall != null ? `${personalBests.overall}` : '–'}
            accentColor={theme.tint}
          />
          <Stat label="Current streak" value={`${streaks.current} day${streaks.current === 1 ? '' : 's'}`} />
          <Stat label="This week" value={`${weeklyCount}/${weeklyGoal}`} />
        </Card>

        <Card>
          <ThemedText type="default">Suggested next session</ThemedText>
          <ThemedText>{suggestedRoutine.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {suggestedRoutine.description}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {suggestedRoutine.exerciseIds.map((id) => exerciseNameById.get(id) ?? id).join(' · ')}
          </ThemedText>
          <View style={styles.cardButton}>
            <Button
              label="Start"
              variant="secondary"
              onPress={handleStartSuggested}
              loading={startingSuggested}
              fullWidth
            />
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <ThemedText type="default">Recent sessions</ThemedText>
          <Link href="/break-log" style={styles.link}>
            <ThemedText type="linkPrimary">Break history</ThemedText>
          </Link>
        </View>

        {recentSessions.length > 0 ? (
          recentSessions.map((session) => (
            <Card key={session.id} style={styles.sessionRow}>
              <View style={styles.sessionInfo}>
                <ThemedText type="default">{formatDate(session.startedAt)}</ThemedText>
                {session.overallNotes ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {session.overallNotes}
                  </ThemedText>
                ) : null}
              </View>
              <View style={styles.sessionMeta}>
                {session.mood != null && <ThemedText style={styles.moodEmoji}>{MOOD_EMOJI[session.mood]}</ThemedText>}
                <ThemedText type="small" themeColor="textSecondary">
                  {session.endedAt != null ? `${session.durationMins ?? 0} min` : 'In progress'}
                </ThemedText>
              </View>
            </Card>
          ))
        ) : (
          <Card>
            <ThemedText themeColor="textSecondary">
              No sessions yet — start one above to begin tracking your progress.
            </ThemedText>
          </Card>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  resumeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cardButton: {
    marginTop: Spacing.one,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  link: {},
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  sessionMeta: {
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
  moodEmoji: {
    fontSize: 20,
  },
});
