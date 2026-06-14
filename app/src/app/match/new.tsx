import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { MATCH_RESULTS, type MatchResult } from '@/db/schema';
import { useTheme } from '@/hooks/use-theme';
import { generateId } from '@/lib/id';
import { MATCH_RESULT_LABELS, MAX_FRAME_SCORE, sanitizeIntegerInput } from '@/lib/match-format';
import { addMatch, type NewMatchFrameInput } from '@/lib/matches';

const MATCH_TYPES = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'league', label: 'League' },
] as const;
type MatchType = (typeof MATCH_TYPES)[number]['value'];

type FrameInput = {
  key: string;
  playerScore: string;
  opponentScore: string;
  playerHighBreak: string;
  opponentHighBreak: string;
};

function emptyFrame(): FrameInput {
  return { key: generateId(), playerScore: '0', opponentScore: '0', playerHighBreak: '', opponentHighBreak: '' };
}

export default function NewMatchScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [opponentName, setOpponentName] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('friendly');
  const [result, setResult] = useState<MatchResult>('win');
  const [framesWon, setFramesWon] = useState(0);
  const [framesLost, setFramesLost] = useState(0);
  const [frames, setFrames] = useState<FrameInput[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const isValid = opponentName.trim().length > 0;

  const computedScore = useMemo(() => {
    const won = frames.filter((frame) => Number(frame.playerScore) > Number(frame.opponentScore)).length;
    const lost = frames.filter((frame) => Number(frame.opponentScore) > Number(frame.playerScore)).length;
    return { won, lost };
  }, [frames]);

  const addFrame = () => setFrames((prev) => [...prev, emptyFrame()]);
  const removeFrame = (key: string) => setFrames((prev) => prev.filter((frame) => frame.key !== key));
  const updateFrame = (key: string, patch: Partial<FrameInput>) =>
    setFrames((prev) => prev.map((frame) => (frame.key === key ? { ...frame, ...patch } : frame)));

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);

    const frameInputs: NewMatchFrameInput[] = frames.map((frame) => ({
      playerScore: Number(frame.playerScore || '0'),
      opponentScore: Number(frame.opponentScore || '0'),
      playerHighBreak: frame.playerHighBreak !== '' ? Number(frame.playerHighBreak) : null,
      opponentHighBreak: frame.opponentHighBreak !== '' ? Number(frame.opponentHighBreak) : null,
    }));

    let matchFramesWon: number | null = null;
    let matchFramesLost: number | null = null;
    if (frameInputs.length > 0) {
      matchFramesWon = computedScore.won;
      matchFramesLost = computedScore.lost;
    } else if (framesWon !== 0 || framesLost !== 0) {
      matchFramesWon = framesWon;
      matchFramesLost = framesLost;
    }

    await addMatch({
      opponentName,
      isLeague: matchType === 'league',
      result,
      framesWon: matchFramesWon,
      framesLost: matchFramesLost,
      notes,
      frames: frameInputs,
    });

    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <ThemedText type="smallBold">Opponent</ThemedText>
          <TextInput
            value={opponentName}
            onChangeText={setOpponentName}
            placeholder="Opponent's name"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </Card>

        <Card>
          <ThemedText type="smallBold">Match type</ThemedText>
          <ChipGroup options={[...MATCH_TYPES]} value={matchType} onChange={setMatchType} />
        </Card>

        <Card>
          <ThemedText type="smallBold">Result</ThemedText>
          <ChipGroup
            options={MATCH_RESULTS.map((value) => ({ value, label: MATCH_RESULT_LABELS[value] }))}
            value={result}
            onChange={setResult}
          />
        </Card>

        {frames.length === 0 ? (
          <Card>
            <ThemedText type="smallBold">Match score (optional)</ThemedText>
            <View style={styles.scoreRow}>
              <View style={styles.scoreField}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Frames won
                </ThemedText>
                <NumericStepper value={framesWon} onChange={setFramesWon} min={0} max={MAX_FRAME_SCORE} />
              </View>
              <View style={styles.scoreField}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Frames lost
                </ThemedText>
                <NumericStepper value={framesLost} onChange={setFramesLost} min={0} max={MAX_FRAME_SCORE} />
              </View>
            </View>
          </Card>
        ) : (
          <Card>
            <ThemedText type="smallBold">Match score</ThemedText>
            <ThemedText themeColor="textSecondary">
              {computedScore.won}–{computedScore.lost} (from frame results below)
            </ThemedText>
          </Card>
        )}

        <View style={styles.framesHeader}>
          <ThemedText type="smallBold">Frame-by-frame (optional)</ThemedText>
          <Button label="Add frame" variant="secondary" size="medium" onPress={addFrame} />
        </View>

        {frames.map((frame, index) => (
          <Card key={frame.key}>
            <View style={styles.frameHeader}>
              <ThemedText type="smallBold">Frame {index + 1}</ThemedText>
              <Pressable
                onPress={() => removeFrame(frame.key)}
                accessibilityRole="button"
                accessibilityLabel={`Remove frame ${index + 1}`}
                style={({ pressed }) => pressed && styles.pressed}>
                <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.scoreRow}>
              <View style={styles.scoreField}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Your score
                </ThemedText>
                <TextInput
                  value={frame.playerScore}
                  onChangeText={(text) => updateFrame(frame.key, { playerScore: sanitizeIntegerInput(text, MAX_FRAME_SCORE) })}
                  keyboardType="number-pad"
                  style={[styles.smallInput, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
              <View style={styles.scoreField}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Opponent score
                </ThemedText>
                <TextInput
                  value={frame.opponentScore}
                  onChangeText={(text) =>
                    updateFrame(frame.key, { opponentScore: sanitizeIntegerInput(text, MAX_FRAME_SCORE) })
                  }
                  keyboardType="number-pad"
                  style={[styles.smallInput, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
            </View>

            <View style={styles.scoreRow}>
              <View style={styles.scoreField}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Your highest break
                </ThemedText>
                <TextInput
                  value={frame.playerHighBreak}
                  onChangeText={(text) =>
                    updateFrame(frame.key, { playerHighBreak: sanitizeIntegerInput(text, MAX_FRAME_SCORE) })
                  }
                  placeholder="–"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  style={[styles.smallInput, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
              <View style={styles.scoreField}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Opponent's highest break
                </ThemedText>
                <TextInput
                  value={frame.opponentHighBreak}
                  onChangeText={(text) =>
                    updateFrame(frame.key, { opponentHighBreak: sanitizeIntegerInput(text, MAX_FRAME_SCORE) })
                  }
                  placeholder="–"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  style={[styles.smallInput, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
            </View>
          </Card>
        ))}

        <Card>
          <ThemedText type="smallBold">Notes</ThemedText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Anything worth remembering about this match?"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[styles.notesInput, { color: theme.text, borderColor: theme.border }]}
          />
        </Card>

        <Button label="Save" onPress={handleSave} disabled={!isValid} loading={saving} fullWidth />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  input: {
    minHeight: 44,
    borderRadius: Radius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 80,
    borderRadius: Radius.medium,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  scoreField: {
    flex: 1,
    gap: Spacing.one,
  },
  center: {
    textAlign: 'center',
  },
  smallInput: {
    minHeight: 44,
    borderRadius: Radius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    textAlign: 'center',
  },
  framesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
