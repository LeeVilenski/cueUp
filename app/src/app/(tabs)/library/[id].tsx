import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BulletList } from '@/components/ui/bullet-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/ui/sparkline';
import { CategoryColors, CategoryLabels, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { DIFFICULTY_LABELS, formatScoring, parseBulletList } from '@/lib/exercise-format';
import { useExercise } from '@/lib/hooks/use-exercises';
import { useActiveSession } from '@/lib/hooks/use-sessions';
import { useRecentAttempts } from '@/lib/hooks/use-session-exercises';
import { startSession } from '@/lib/sessions';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { exercise, loading } = useExercise(id);
  const { attempts, loading: attemptsLoading } = useRecentAttempts(id);
  const { activeSession } = useActiveSession();
  const [addingToSession, setAddingToSession] = useState(false);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!exercise) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Exercise not found.</ThemedText>
      </ThemedView>
    );
  }

  const sparklineValues = attempts
    .map((attempt) => attempt.resultValue)
    .filter((value): value is number => value != null)
    .reverse();

  const handleAddToSession = async () => {
    setAddingToSession(true);
    if (activeSession) {
      router.push(`/session/${activeSession.id}/active?addExercise=${exercise.id}`);
    } else {
      const sessionId = await startSession();
      router.push(`/session/${sessionId}/active?exercises=${exercise.id}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.categoryBadge, { backgroundColor: CategoryColors[exercise.category] }]}>
            <ThemedText type="small" style={styles.categoryBadgeText}>
              {CategoryLabels[exercise.category]}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {DIFFICULTY_LABELS[exercise.difficulty]}
          </ThemedText>
        </View>

        <ThemedText type="subtitle">{exercise.name}</ThemedText>

        <ThemedText>{exercise.description}</ThemedText>

        <Card>
          <ThemedText type="smallBold">Scoring</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatScoring(exercise)}
            {exercise.suggestedDurationMins ? ` · ~${exercise.suggestedDurationMins} min` : ''}
          </ThemedText>
        </Card>

        <Card>
          <ThemedText type="smallBold">Best Practice Tips</ThemedText>
          <BulletList items={parseBulletList(exercise.bestPracticeTips)} />
        </Card>

        <Card>
          <ThemedText type="smallBold">Recent Attempts</ThemedText>
          {!attemptsLoading && attempts.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              No attempts logged yet — complete this exercise in a session to start tracking your progress.
            </ThemedText>
          ) : (
            <>
              {sparklineValues.length > 0 && <Sparkline values={sparklineValues} />}
              <View style={styles.attemptStats}>
                <ThemedText type="small" themeColor="textSecondary">
                  Logged {attempts.length} time{attempts.length === 1 ? '' : 's'}
                </ThemedText>
                {sparklineValues.length > 0 && (
                  <ThemedText type="small" themeColor="textSecondary">
                    Best: {Math.max(...sparklineValues)} · Latest: {sparklineValues[sparklineValues.length - 1]}
                  </ThemedText>
                )}
              </View>
            </>
          )}
        </Card>

        <Button label="Add to session" onPress={handleAddToSession} loading={addingToSession} fullWidth />
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
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  categoryBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  categoryBadgeText: {
    color: '#ffffff',
  },
  attemptStats: {
    gap: Spacing.half,
  },
});
