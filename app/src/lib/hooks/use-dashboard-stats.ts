import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';

import type { ExerciseCategory } from '@/db/schema';
import { useAppSettings } from '@/lib/hooks/use-app-settings';
import { useBreakLogs } from '@/lib/hooks/use-break-logs';
import { useExercises } from '@/lib/hooks/use-exercises';
import { useAllSessionExerciseResults, useSessions } from '@/lib/hooks/use-sessions';
import { getBreakTrend, getPersonalBests, getRollingAverage } from '@/lib/stats/breaks';
import { getCategoryCoverage, getNeglectedCategories } from '@/lib/stats/categories';
import { getSessionStreaks, getTotalPracticeMinutes, getWeeklySessionCount } from '@/lib/stats/sessions';
import { suggestRoutine } from '@/lib/stats/suggestions';
import { getWeakAreas } from '@/lib/stats/weak-areas';

const COVERAGE_WINDOW_DAYS = 30;

export function useDashboardStats() {
  const { breakLogs, loading: breakLogsLoading, refresh: refreshBreakLogs } = useBreakLogs();
  const { sessions, loading: sessionsLoading, refresh: refreshSessions } = useSessions();
  const { results, loading: resultsLoading, refresh: refreshResults } = useAllSessionExerciseResults();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { settings, loading: settingsLoading, refresh: refreshSettings } = useAppSettings();

  useFocusEffect(
    useCallback(() => {
      refreshBreakLogs();
      refreshSessions();
      refreshResults();
      refreshSettings();
    }, [refreshBreakLogs, refreshSessions, refreshResults, refreshSettings]),
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

  return {
    loading: breakLogsLoading || sessionsLoading || resultsLoading || exercisesLoading || settingsLoading,
    breakLogs,
    sessions,
    results,
    settings,
    weeklyGoal: settings?.weeklySessionGoal ?? 3,
    personalBests,
    rollingAverage,
    breakTrend,
    streaks,
    weeklyCount,
    totalMinutes,
    coverage,
    neglected,
    weakAreas,
    exerciseNameById,
    suggestedRoutine,
    coverageWindowDays: COVERAGE_WINDOW_DAYS,
  };
}
