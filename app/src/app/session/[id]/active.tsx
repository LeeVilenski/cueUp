import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BulletList } from '@/components/ui/bullet-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { CategoryColors, CategoryLabels, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { type Exercise } from '@/db/schema';
import { MAX_BREAK_SCORE } from '@/lib/break-format';
import { DIFFICULTY_LABELS, parseBulletList } from '@/lib/exercise-format';
import { useExercises } from '@/lib/hooks/use-exercises';
import { useSession } from '@/lib/hooks/use-sessions';
import { addSessionExercise } from '@/lib/sessions';
import { useTheme } from '@/hooks/use-theme';

export default function ActiveSessionScreen() {
  const { id, exercises: exercisesParam, addExercise } = useLocalSearchParams<{
    id: string;
    exercises?: string;
    addExercise?: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  const { session } = useSession(id);
  const { exercises: library } = useExercises();

  const [queue, setQueue] = useState<string[]>(() => {
    const initial = exercisesParam ? exercisesParam.split(',').filter(Boolean) : [];
    if (addExercise && !initial.includes(addExercise)) {
      return [...initial, addExercise];
    }
    return initial;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [numericValue, setNumericValue] = useState(0);
  const [breakScore, setBreakScore] = useState('');
  const [passFail, setPassFail] = useState<'pass' | 'fail'>('pass');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!session) return;
    const start = new Date(session.startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    setNumericValue(0);
    setBreakScore('');
    setPassFail('pass');
    setNotes('');
  }, [currentIndex]);

  const currentExercise = library.find((exercise) => exercise.id === queue[currentIndex]) ?? null;
  const isLast = currentIndex >= queue.length - 1;

  const handleLogAndNext = async () => {
    if (!currentExercise || !id) return;

    let value: number | null;
    switch (currentExercise.scoringType) {
      case 'break_value':
        value = breakScore === '' ? null : Number(breakScore);
        break;
      case 'pass_fail':
        value = passFail === 'pass' ? 1 : 0;
        break;
      case 'notes_only':
        value = null;
        break;
      default:
        value = numericValue;
    }

    await addSessionExercise({
      sessionId: id,
      exerciseId: currentExercise.id,
      orderIndex: currentIndex,
      resultValue: value,
      resultNotes: notes.trim() ? notes.trim() : null,
    });

    if (isLast) {
      router.replace(`/session/${id}/summary`);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  };

  const handleAddExercise = (exerciseId: string) => {
    setQueue((q) => [...q, exerciseId]);
    setPickerOpen(false);
  };

  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');

  if (pickerOpen) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="subtitle">Add exercise</ThemedText>
          <FlatList
            data={library}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleAddExercise(item.id)}
                style={({ pressed }) => [
                  styles.exerciseRow,
                  { borderColor: theme.border },
                  pressed && styles.pressed,
                ]}>
                <View style={[styles.categoryDot, { backgroundColor: CategoryColors[item.category] }]} />
                <ThemedText type="default" style={styles.exerciseRowText}>
                  {item.name}
                </ThemedText>
              </Pressable>
            )}
          />
          <Button label="Cancel" variant="ghost" onPress={() => setPickerOpen(false)} fullWidth />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Session</ThemedText>
          <ThemedText type="title" style={styles.timer}>
            {minutes}:{seconds}
          </ThemedText>
        </View>

        {currentExercise ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedText type="small" themeColor="textSecondary">
              Exercise {currentIndex + 1} of {queue.length}
            </ThemedText>

            <Card>
              <View style={styles.badgeRow}>
                <View style={[styles.categoryDot, { backgroundColor: CategoryColors[currentExercise.category] }]} />
                <ThemedText type="small" themeColor="textSecondary">
                  {CategoryLabels[currentExercise.category]} · {DIFFICULTY_LABELS[currentExercise.difficulty]}
                </ThemedText>
              </View>
              <ThemedText type="default">{currentExercise.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {currentExercise.description}
              </ThemedText>
              <BulletList items={parseBulletList(currentExercise.bestPracticeTips)} />
            </Card>

            <Card>
              <ThemedText type="smallBold">Result</ThemedText>
              <ResultInput
                exercise={currentExercise}
                numericValue={numericValue}
                onNumericChange={setNumericValue}
                breakScore={breakScore}
                onBreakScoreChange={setBreakScore}
                passFail={passFail}
                onPassFailChange={setPassFail}
              />
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes (optional)"
                placeholderTextColor={theme.textSecondary}
                multiline
                style={[styles.notesInput, { color: theme.text, borderColor: theme.border }]}
              />
            </Card>

            <Button label={isLast ? 'Log & Finish' : 'Log & Next'} onPress={handleLogAndNext} fullWidth />
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText themeColor="textSecondary" style={styles.center}>
              No exercises queued. Add one or finish your session.
            </ThemedText>
          </View>
        )}

        <View style={styles.footer}>
          <Button label="Add exercise" variant="secondary" onPress={() => setPickerOpen(true)} fullWidth />
          <Button
            label="Finish session"
            variant="ghost"
            onPress={() => router.replace(`/session/${id}/summary`)}
            fullWidth
          />
        </View>
      </View>
    </ThemedView>
  );
}

function ResultInput({
  exercise,
  numericValue,
  onNumericChange,
  breakScore,
  onBreakScoreChange,
  passFail,
  onPassFailChange,
}: {
  exercise: Exercise;
  numericValue: number;
  onNumericChange: (value: number) => void;
  breakScore: string;
  onBreakScoreChange: (value: string) => void;
  passFail: 'pass' | 'fail';
  onPassFailChange: (value: 'pass' | 'fail') => void;
}) {
  const theme = useTheme();

  switch (exercise.scoringType) {
    case 'score_out_of':
    case 'count_potted':
      return (
        <View style={styles.resultInput}>
          <NumericStepper
            value={numericValue}
            onChange={onNumericChange}
            min={0}
            max={exercise.scoringTarget ?? undefined}
          />
          {exercise.scoringTarget != null ? (
            <ThemedText themeColor="textSecondary" style={styles.center}>
              out of {exercise.scoringTarget} {exercise.scoringUnit ?? ''}
            </ThemedText>
          ) : null}
        </View>
      );
    case 'time_based':
      return (
        <View style={styles.resultInput}>
          <NumericStepper value={numericValue} onChange={onNumericChange} min={0} step={5} />
          <ThemedText themeColor="textSecondary" style={styles.center}>
            minutes
          </ThemedText>
        </View>
      );
    case 'break_value':
      return (
        <View style={styles.resultInput}>
          <TextInput
            value={breakScore}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 3);
              onBreakScoreChange(cleaned !== '' && Number(cleaned) > MAX_BREAK_SCORE ? `${MAX_BREAK_SCORE}` : cleaned);
            }}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            maxLength={3}
            style={[styles.breakScoreInput, { color: theme.text, borderColor: theme.border }]}
          />
          <ThemedText themeColor="textSecondary" style={styles.center}>
            highest break (out of {MAX_BREAK_SCORE})
          </ThemedText>
        </View>
      );
    case 'pass_fail':
      return (
        <View style={styles.centerRow}>
          <ChipGroup
            options={[
              { value: 'pass', label: 'Pass' },
              { value: 'fail', label: 'Fail' },
            ]}
            value={passFail}
            onChange={onPassFailChange}
          />
        </View>
      );
    case 'notes_only':
    default:
      return <ThemedText themeColor="textSecondary">Use the notes field below to record how it went.</ThemedText>;
  }
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
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timer: {
    fontSize: 32,
    lineHeight: 36,
  },
  scrollContent: {
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
  resultInput: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  centerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  breakScoreInput: {
    width: 120,
    fontSize: 48,
    fontWeight: 700,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingVertical: Spacing.two,
  },
  notesInput: {
    minHeight: 60,
    borderRadius: Radius.medium,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: Spacing.two,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  exerciseRowText: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
