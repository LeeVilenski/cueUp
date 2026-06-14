import type { BreakLog, Exercise, Session, SessionExercise } from '@/db/schema';

export function makeBreakLog(overrides: Partial<BreakLog> = {}): BreakLog {
  return {
    id: 'break-1',
    score: 0,
    context: 'practice',
    sessionId: null,
    achievedAt: '2024-01-01T00:00:00.000Z',
    notes: null,
    isPersonalBest: false,
    syncStatus: 'pending',
    remoteId: null,
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 'session-1',
    startedAt: '2024-01-01T12:00:00.000Z',
    endedAt: null,
    durationMins: null,
    location: null,
    overallNotes: null,
    mood: null,
    syncStatus: 'pending',
    remoteId: null,
    updatedAt: '2024-01-01T12:00:00.000Z',
    ...overrides,
  };
}

export function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: 'exercise-1',
    slug: 'exercise-1',
    name: 'Exercise 1',
    category: 'potting',
    description: '',
    bestPracticeTips: '',
    difficulty: 'beginner',
    suggestedDurationMins: null,
    scoringType: 'score_out_of',
    scoringTarget: 10,
    scoringUnit: null,
    isBuiltIn: true,
    sortOrder: 0,
    syncStatus: 'pending',
    remoteId: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeSessionExercise(overrides: Partial<SessionExercise> = {}): SessionExercise {
  return {
    id: 'session-exercise-1',
    sessionId: 'session-1',
    exerciseId: 'exercise-1',
    orderIndex: 0,
    resultValue: null,
    resultNotes: null,
    durationSecs: null,
    completedAt: '2024-01-01T00:00:00.000Z',
    syncStatus: 'pending',
    remoteId: null,
    ...overrides,
  };
}
