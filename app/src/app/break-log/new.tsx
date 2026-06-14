import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { ChipGroup } from '@/components/ui/chip';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { BREAK_CONTEXTS, type BreakContext } from '@/db/schema';
import { BREAK_CONTEXT_LABELS, MAX_BREAK_SCORE } from '@/lib/break-format';
import { addBreakLog } from '@/lib/break-logs';
import { useAppSettings } from '@/lib/hooks/use-app-settings';
import { useTheme } from '@/hooks/use-theme';

export default function NewBreakLogScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { settings } = useAppSettings();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();

  const [score, setScore] = useState('');
  const [context, setContext] = useState<BreakContext>('practice');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    context: BreakContext;
    isNewPersonalBest: boolean;
  } | null>(null);

  useEffect(() => {
    if (settings) {
      setContext(settings.quickLogDefaultContext);
    }
  }, [settings]);

  const scoreValue = Number(score);
  const isValid = score !== '' && Number.isInteger(scoreValue) && scoreValue >= 0 && scoreValue <= MAX_BREAK_SCORE;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    const { isNewPersonalBest } = await addBreakLog({
      score: scoreValue,
      context,
      notes,
      sessionId: sessionId ?? null,
    });
    setSaving(false);
    setResult({ score: scoreValue, context, isNewPersonalBest });
  };

  if (result) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.successContent}>
          <ThemedText type="title" style={styles.successScore}>
            {result.score}
          </ThemedText>
          {result.isNewPersonalBest ? (
            <ThemedText type="subtitle" themeColor="tint" style={styles.center}>
              🎉 New personal best!
            </ThemedText>
          ) : (
            <ThemedText type="subtitle" style={styles.center}>
              Break logged
            </ThemedText>
          )}
          <ThemedText themeColor="textSecondary" style={styles.center}>
            {BREAK_CONTEXT_LABELS[result.context]}
          </ThemedText>
          <Button label="Done" onPress={() => router.back()} fullWidth />
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <View>
            <TextInput
              value={score}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 3);
                setScore(cleaned !== '' && Number(cleaned) > MAX_BREAK_SCORE ? `${MAX_BREAK_SCORE}` : cleaned);
              }}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              maxLength={3}
              autoFocus
              style={[styles.scoreInput, { color: theme.text }]}
            />
            <ThemedText themeColor="textSecondary" style={styles.center}>
              out of {MAX_BREAK_SCORE}
            </ThemedText>
          </View>

          <View style={styles.centerRow}>
            <ChipGroup
              options={BREAK_CONTEXTS.map((value) => ({ value, label: BREAK_CONTEXT_LABELS[value] }))}
              value={context}
              onChange={setContext}
            />
          </View>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[
              styles.notesInput,
              { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          />

          <Button label="Save" onPress={handleSave} disabled={!isValid} loading={saving} fullWidth />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    gap: Spacing.four,
    justifyContent: 'center',
  },
  scoreInput: {
    fontSize: 96,
    fontWeight: 700,
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
  centerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  notesInput: {
    minHeight: 80,
    borderRadius: Radius.medium,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  successContent: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successScore: {
    fontSize: 96,
  },
});
