import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { CategoryColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import type { Exercise, SessionExercise } from '@/db/schema';
import { useSession, useSessionExerciseResults } from '@/lib/hooks/use-sessions';
import { MOOD_EMOJI } from '@/lib/mood-format';
import { finishSession } from '@/lib/sessions';
import { useTheme } from '@/hooks/use-theme';

const MOODS = [1, 2, 3, 4, 5] as const;

export default function SessionSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { session } = useSession(id);
  const { results } = useSessionExerciseResults(id);

  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;
    const startedAt = new Date(session.startedAt).getTime();
    const minutesElapsed = Math.max(5, Math.round((Date.now() - startedAt) / 60000 / 5) * 5);
    setDuration(session.durationMins ?? minutesElapsed);
    setNotes(session.overallNotes ?? '');
    setMood(session.mood ?? null);
  }, [session]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    await finishSession({
      id,
      durationMins: duration,
      overallNotes: notes.trim() ? notes.trim() : null,
      mood,
    });
    router.dismissAll();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {results.length > 0 ? (
          <Card>
            <ThemedText type="smallBold">Exercises completed</ThemedText>
            {results.map(({ sessionExercise, exercise }) => (
              <View key={sessionExercise.id} style={styles.resultRow}>
                <View style={[styles.categoryDot, { backgroundColor: CategoryColors[exercise.category] }]} />
                <View style={styles.resultText}>
                  <ThemedText type="default">{exercise.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatResult(sessionExercise, exercise)}
                  </ThemedText>
                </View>
              </View>
            ))}
          </Card>
        ) : (
          <ThemedText themeColor="textSecondary">No exercises were logged this session.</ThemedText>
        )}

        <Card>
          <ThemedText type="smallBold">Duration (minutes)</ThemedText>
          <NumericStepper value={duration} onChange={setDuration} min={0} step={5} />
        </Card>

        <Card>
          <ThemedText type="smallBold">How did it feel?</ThemedText>
          <View style={styles.moodRow}>
            {MOODS.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`Mood ${value} of 5`}
                accessibilityState={{ selected: mood === value }}
                onPress={() => setMood(value)}
                style={({ pressed }) => [
                  styles.moodButton,
                  { backgroundColor: mood === value ? theme.tint : theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={styles.moodEmoji}>{MOOD_EMOJI[value]}</ThemedText>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card>
          <ThemedText type="smallBold">Notes</ThemedText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="How did the session go?"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[styles.notesInput, { color: theme.text, borderColor: theme.border }]}
          />
        </Card>

        <Button
          label="Log a high break from this session"
          variant="secondary"
          onPress={() => router.push(`/break-log/new?sessionId=${id}`)}
          fullWidth
        />

        <Button label="Save" onPress={handleSave} loading={saving} fullWidth />
      </ScrollView>
    </ThemedView>
  );
}

function formatResult(sessionExercise: SessionExercise, exercise: Exercise): string {
  if (sessionExercise.resultValue == null) {
    return sessionExercise.resultNotes ?? 'Completed';
  }

  switch (exercise.scoringType) {
    case 'pass_fail':
      return sessionExercise.resultValue >= 1 ? 'Pass' : 'Fail';
    case 'break_value':
      return `Break of ${sessionExercise.resultValue}`;
    case 'time_based':
      return `${sessionExercise.resultValue} min`;
    default: {
      const target = exercise.scoringTarget != null ? ` / ${exercise.scoringTarget}` : '';
      const unit = exercise.scoringUnit ? ` ${exercise.scoringUnit}` : '';
      return `${sessionExercise.resultValue}${target}${unit}`;
    }
  }
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
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  resultText: {
    flex: 1,
    gap: Spacing.half,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
    marginTop: 6,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
  },
  moodEmoji: {
    fontSize: 28,
  },
  notesInput: {
    minHeight: 80,
    borderRadius: Radius.medium,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.6,
  },
});
