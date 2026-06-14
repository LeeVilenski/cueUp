import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, SectionList, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BulletList } from '@/components/ui/bullet-list';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip';
import { CategoryColors, CategoryLabels, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { EXERCISE_CATEGORIES, type Exercise, type ExerciseCategory, type Tip } from '@/db/schema';
import { DIFFICULTY_LABELS, formatScoring, parseBulletList } from '@/lib/exercise-format';
import { useExercises } from '@/lib/hooks/use-exercises';
import { useTips } from '@/lib/hooks/use-tips';
import { TIP_CATEGORY_LABELS } from '@/lib/tip-format';
import { useTheme } from '@/hooks/use-theme';

type LibraryTab = 'exercises' | 'tips';

type ExerciseSection = {
  category: ExerciseCategory;
  title: string;
  data: Exercise[];
};

export default function LibraryScreen() {
  const [tab, setTab] = useState<LibraryTab>('exercises');
  const [search, setSearch] = useState('');
  const { exercises, loading: exercisesLoading } = useExercises();
  const { tips, loading: tipsLoading } = useTips();
  const theme = useTheme();

  const sections = useMemo<ExerciseSection[]>(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? exercises.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(query) ||
            exercise.description.toLowerCase().includes(query)
        )
      : exercises;

    return EXERCISE_CATEGORIES.map((category) => ({
      category,
      title: CategoryLabels[category],
      data: filtered.filter((exercise) => exercise.category === category),
    })).filter((section) => section.data.length > 0);
  }, [exercises, search]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ChipGroup
            options={[
              { value: 'exercises', label: 'Exercises' },
              { value: 'tips', label: 'Best Practices' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {tab === 'exercises' ? (
          <>
            <View style={[styles.searchRow, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="search" size={18} color={theme.textSecondary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search exercises"
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInput, { color: theme.text }]}
              />
            </View>

            {!exercisesLoading && sections.length === 0 ? (
              <ThemedText themeColor="textSecondary" style={styles.empty}>
                No exercises match your search.
              </ThemedText>
            ) : (
              <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section }) => (
                  <View style={styles.sectionHeader}>
                    <View style={[styles.categoryDot, { backgroundColor: CategoryColors[section.category] }]} />
                    <ThemedText type="smallBold">{section.title}</ThemedText>
                  </View>
                )}
                renderItem={({ item }) => <ExerciseRow exercise={item} />}
              />
            )}
          </>
        ) : (
          <FlatList
            data={tips}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <TipCard tip={item} />}
            ListEmptyComponent={
              !tipsLoading ? (
                <ThemedText themeColor="textSecondary" style={styles.empty}>
                  No best-practice tips yet.
                </ThemedText>
              ) : null
            }
          />
        )}
      </View>
    </ThemedView>
  );
}

function ExerciseRow({ exercise }: { exercise: Exercise }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.push(`/library/${exercise.id}`)}
      style={({ pressed }) => [styles.row, { borderColor: theme.border }, pressed && styles.pressed]}>
      <View style={styles.rowText}>
        <ThemedText type="default">{exercise.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatScoring(exercise)} · {DIFFICULTY_LABELS[exercise.difficulty]}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

function TipCard({ tip }: { tip: Tip }) {
  return (
    <Card style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <ThemedText type="default" style={styles.tipTitle}>
          {tip.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {TIP_CATEGORY_LABELS[tip.category]}
        </ThemedText>
      </View>
      <BulletList items={parseBulletList(tip.body)} />
    </Card>
  );
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
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.five,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.6,
  },
  tipCard: {
    marginBottom: Spacing.two,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  tipTitle: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    paddingTop: Spacing.five,
  },
});
