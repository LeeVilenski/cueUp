import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/ui/sparkline';
import { Stat } from '@/components/ui/stat';
import { CategoryColors, CategoryLabels, MaxContentWidth, Spacing } from '@/constants/theme';
import { BREAK_CONTEXTS, EXERCISE_CATEGORIES, type ExerciseCategory } from '@/db/schema';
import { useTheme } from '@/hooks/use-theme';
import { BREAK_CONTEXT_LABELS } from '@/lib/break-format';
import { useAppSettings } from '@/lib/hooks/use-app-settings';
import { useBreakLogs } from '@/lib/hooks/use-break-logs';
import { useExercises } from '@/lib/hooks/use-exercises';
import { useAllSessionExerciseResults, useSessions } from '@/lib/hooks/use-sessions';
import { startSession } from '@/lib/sessions';
import { getBreakTrend, getPersonalBests, getRollingAverage } from '@/lib/stats/breaks';
import { getCategoryCoverage, getNeglectedCategories } from '@/lib/stats/categories';
import { getSessionStreaks, getTotalPracticeMinutes, getWeeklySessionCount } from '@/lib/stats/sessions';
import { suggestRoutine } from '@/lib/stats/suggestions';
import { getWeakAreas } from '@/lib/stats/weak-areas';

const COVERAGE_WINDOW_DAYS = 30;

function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export default function ProgressScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { breakLogs, refresh: refreshBreakLogs } = useBreakLogs();
  const { sessions, refresh: refreshSessions } = useSessions();
  const { results, refresh: refreshResults } = useAllSessionExerciseResults();
  const { exercises } = useExercises();
  const { settings } = useAppSettings();
  const [startingSuggested, setStartingSuggested] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshBreakLogs();
      refreshSessions();
      refreshResults();
    }, [refreshBreakLogs, refreshSessions, refreshResults]),
  );

  const personalBests = useMemo(() => getPersonalBests(breakLogs), [breakLogs]);
  const rollingAverage = useMemo(() => getRollingAverage(breakLogs), [breakLogs]);
  const breakTrend = useMemo(() => getBreakTrend(breakLogs), [breakLogs]);
  const streaks = useMemo(() => getSessionStreaks(sessions), [sessions]);
  const weeklyCount = useMemo(() => getWeeklySessionCount(sessions), [sessions]);
  const totalMinutes = useMemo(() => getTotalPracticeMinutes(sessions), [sessions]);
  const coverage = useMemo(() => getCategoryCoverage(results, COVERAGE_WINDOW_DAYS), [results]);
  const neglected = useMemo(() => getNeglectedCategories(coverage), [coverage]);
  const weakAreas = useMemo(() => getWeakAreas(results), [results]);

  const exerciseNameById = useMemo(() => {
    const map = new Map<string, string>();
    exercises.forEach((exercise) => map.set(exercise.id, exercise.name));
    return map;
  }, [exercises]);

  const exerciseCategoryById = useMemo(() => {
    const map = new Map<string, ExerciseCategory>();
    exercises.forEach((exercise) => map.set(exercise.id, exercise.category));
    return map;
  }, [exercises]);

  const suggestedRoutine = useMemo(
    () => suggestRoutine(coverage, exerciseCategoryById),
    [coverage, exerciseCategoryById],
  );

  const weeklyGoal = settings?.weeklySessionGoal ?? 3;

  const handleStartSuggested = async () => {
    setStartingSuggested(true);
    const sessionId = await startSession();
    router.push(`/session/${sessionId}/active?exercises=${suggestedRoutine.exerciseIds.join(',')}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle">Progress</ThemedText>

        <Card style={styles.statsGrid}>
          <Stat
            label="Personal best"
            value={personalBests.overall != null ? `${personalBests.overall}` : '–'}
            accentColor={theme.tint}
          />
          <Stat label="Rolling average" value={rollingAverage != null ? rollingAverage.toFixed(1) : '–'} />
          <Stat label="Current streak" value={`${streaks.current} day${streaks.current === 1 ? '' : 's'}`} />
          <Stat label="This week" value={`${weeklyCount}/${weeklyGoal}`} />
        </Card>

        <Card>
          <ThemedText type="default">Break trend</ThemedText>
          {breakTrend.length > 0 ? (
            <>
              <Sparkline values={breakTrend.map((point) => point.score)} />
              <ThemedText type="small" themeColor="textSecondary">
                Last {breakTrend.length} break{breakTrend.length === 1 ? '' : 's'} logged
              </ThemedText>
            </>
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              Log a break to start tracking your trend.
            </ThemedText>
          )}
        </Card>

        <Card style={styles.statsGrid}>
          {BREAK_CONTEXTS.map((context) => (
            <Stat
              key={context}
              label={BREAK_CONTEXT_LABELS[context]}
              value={personalBests.byContext[context] != null ? `${personalBests.byContext[context]}` : '–'}
            />
          ))}
        </Card>

        <Card>
          <ThemedText type="default">Category coverage (last {COVERAGE_WINDOW_DAYS} days)</ThemedText>
          {EXERCISE_CATEGORIES.map((category) => (
            <View key={category} style={styles.coverageRow}>
              <View style={[styles.categoryDot, { backgroundColor: CategoryColors[category] }]} />
              <ThemedText style={styles.coverageLabel}>{CategoryLabels[category]}</ThemedText>
              <ThemedText themeColor="textSecondary">
                {coverage[category]} session{coverage[category] === 1 ? '' : 's'}
              </ThemedText>
            </View>
          ))}
          {neglected.length > 0 && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.coverageNote}>
              Not practiced recently: {neglected.map((category) => CategoryLabels[category]).join(', ')}
            </ThemedText>
          )}
        </Card>

        {weakAreas.length > 0 && (
          <Card>
            <ThemedText type="default">Focus areas</ThemedText>
            {weakAreas.map((weakArea) => (
              <View key={weakArea.exercise.id} style={styles.coverageRow}>
                <View style={[styles.categoryDot, { backgroundColor: CategoryColors[weakArea.exercise.category] }]} />
                <ThemedText style={styles.coverageLabel}>{weakArea.exercise.name}</ThemedText>
                <ThemedText themeColor="textSecondary">{Math.round(weakArea.averageRatio * 100)}% of target</ThemedText>
              </View>
            ))}
          </Card>
        )}

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
            <Button label="Start" variant="secondary" onPress={handleStartSuggested} loading={startingSuggested} fullWidth />
          </View>
        </Card>

        <Card style={styles.statsGrid}>
          <Stat label="Sessions logged" value={`${sessions.length}`} />
          <Stat label="Total practice time" value={formatMinutes(totalMinutes)} />
          <Stat label="Longest streak" value={`${streaks.longest} day${streaks.longest === 1 ? '' : 's'}`} />
        </Card>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  coverageLabel: {
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  coverageNote: {
    marginTop: Spacing.one,
  },
  cardButton: {
    marginTop: Spacing.one,
  },
});
