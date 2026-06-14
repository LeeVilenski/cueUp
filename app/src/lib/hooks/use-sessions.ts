import { asc, eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { exercises, sessionExercises, sessions, type Exercise, type Session, type SessionExercise } from '@/db/schema';

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
