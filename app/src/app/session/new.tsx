import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useExercises } from '@/lib/hooks/use-exercises';
import { ROUTINES } from '@/lib/routines';
import { startSession } from '@/lib/sessions';

export default function NewSessionScreen() {
  const router = useRouter();
  const { exercises } = useExercises();
  const [starting, setStarting] = useState<string | null>(null);

  const exerciseNameById = useMemo(() => {
    const map = new Map<string, string>();
    exercises.forEach((exercise) => map.set(exercise.id, exercise.name));
    return map;
  }, [exercises]);

  const handleStart = async (exerciseIds: string[], key: string) => {
    setStarting(key);
    const sessionId = await startSession();
    router.replace(`/session/${sessionId}/active?exercises=${exerciseIds.join(',')}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Button
          label="Quick Start"
          onPress={() => handleStart([], 'quick')}
          loading={starting === 'quick'}
          fullWidth
        />

        <ThemedText themeColor="textSecondary">Or follow a curated routine:</ThemedText>

        {ROUTINES.map((routine) => (
          <Card key={routine.id}>
            <ThemedText type="default">{routine.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {routine.description}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {routine.exerciseIds.map((id) => exerciseNameById.get(id) ?? id).join(' · ')}
            </ThemedText>
            <View style={styles.cardButton}>
              <Button
                label="Start"
                variant="secondary"
                onPress={() => handleStart(routine.exerciseIds, routine.id)}
                loading={starting === routine.id}
                fullWidth
              />
            </View>
          </Card>
        ))}
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
  cardButton: {
    marginTop: Spacing.one,
  },
});
