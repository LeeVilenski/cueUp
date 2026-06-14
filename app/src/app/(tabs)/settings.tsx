import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { BREAK_CONTEXTS, type BreakContext } from '@/db/schema';
import { useTheme } from '@/hooks/use-theme';
import { BREAK_CONTEXT_LABELS } from '@/lib/break-format';
import { useAppSettings } from '@/lib/hooks/use-app-settings';
import { updateSettings } from '@/lib/settings';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, loading, refresh } = useAppSettings();

  const [playerName, setPlayerName] = useState('');
  const [defaultSessionDurationMins, setDefaultSessionDurationMins] = useState(30);
  const [quickLogDefaultContext, setQuickLogDefaultContext] = useState<BreakContext>('practice');
  const [weeklySessionGoal, setWeeklySessionGoal] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setPlayerName(settings.playerName ?? '');
    setDefaultSessionDurationMins(settings.defaultSessionDurationMins);
    setQuickLogDefaultContext(settings.quickLogDefaultContext);
    setWeeklySessionGoal(settings.weeklySessionGoal);
  }, [settings]);

  const markDirty = () => setSaved(false);

  const handleSave = async () => {
    setSaving(true);
    await updateSettings({
      playerName: playerName.trim() ? playerName.trim() : null,
      defaultSessionDurationMins,
      quickLogDefaultContext,
      weeklySessionGoal,
    });
    await refresh();
    setSaving(false);
    setSaved(true);
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle">Settings</ThemedText>

        <Card>
          <ThemedText type="smallBold">Player name</ThemedText>
          <TextInput
            value={playerName}
            onChangeText={(text) => {
              setPlayerName(text);
              markDirty();
            }}
            placeholder="Your name"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </Card>

        <Card>
          <ThemedText type="smallBold">Default session duration</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Starting point for the duration shown on the session summary.
          </ThemedText>
          <NumericStepper
            value={defaultSessionDurationMins}
            onChange={(value) => {
              setDefaultSessionDurationMins(value);
              markDirty();
            }}
            min={5}
            max={180}
            step={5}
          />
        </Card>

        <Card>
          <ThemedText type="smallBold">Default break-log context</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Pre-selected when you log a break.
          </ThemedText>
          <ChipGroup
            options={BREAK_CONTEXTS.map((value) => ({ value, label: BREAK_CONTEXT_LABELS[value] }))}
            value={quickLogDefaultContext}
            onChange={(value) => {
              setQuickLogDefaultContext(value);
              markDirty();
            }}
          />
        </Card>

        <Card>
          <ThemedText type="smallBold">Weekly session goal</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Used for the "This week" progress shown on Home and Progress.
          </ThemedText>
          <NumericStepper
            value={weeklySessionGoal}
            onChange={(value) => {
              setWeeklySessionGoal(value);
              markDirty();
            }}
            min={1}
            max={14}
            step={1}
          />
        </Card>

        <Button label={saved ? 'Saved' : 'Save'} onPress={handleSave} loading={saving} fullWidth />

        <Card>
          <ThemedText type="smallBold">Sync</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Syncing to a web portal is coming in a future update. For now, all data stays on this device.
          </ThemedText>
          <View style={styles.cardButton}>
            <Button label="Sync now" variant="secondary" disabled fullWidth />
          </View>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    minHeight: 44,
    borderRadius: Radius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  cardButton: {
    marginTop: Spacing.one,
  },
});
