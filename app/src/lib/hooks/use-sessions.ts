import { asc, desc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { exercises, sessionExercises, sessions, type Exercise, type Session, type SessionExercise } from '@/db/schema';

export function useSessions() {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await getDatabase().select().from(sessions).orderBy(desc(sessions.startedAt));
    setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sessions: data, loading, refresh };
}

export function useSession(id: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setSession(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getDatabase()
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1)
      .then((rows) => {
        if (active) {
          setSession(rows[0] ?? null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { session, loading };
}

export type SessionExerciseResult = {
  sessionExercise: SessionExercise;
  exercise: Exercise;
};

export function useSessionExerciseResults(sessionId: string | undefined) {
  const [results, setResults] = useState<SessionExerciseResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setResults([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getDatabase()
      .select({ sessionExercise: sessionExercises, exercise: exercises })
      .from(sessionExercises)
      .innerJoin(exercises, eq(sessionExercises.exerciseId, exercises.id))
      .where(eq(sessionExercises.sessionId, sessionId))
      .orderBy(asc(sessionExercises.orderIndex))
      .then((rows) => {
        if (active) {
          setResults(rows);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  return { results, loading };
}

export function useAllSessionExerciseResults() {
  const [results, setResults] = useState<SessionExerciseResult[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await getDatabase()
      .select({ sessionExercise: sessionExercises, exercise: exercises })
      .from(sessionExercises)
      .innerJoin(exercises, eq(sessionExercises.exerciseId, exercises.id))
      .orderBy(desc(sessionExercises.completedAt));
    setResults(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { results, loading, refresh };
}
