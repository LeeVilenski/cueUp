import { desc, eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { sessionExercises, type SessionExercise } from '@/db/schema';

export function useRecentAttempts(exerciseId: string | undefined, limit = 10) {
  const [attempts, setAttempts] = useState<SessionExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!exerciseId) {
      setAttempts([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getDatabase()
      .select()
      .from(sessionExercises)
      .where(eq(sessionExercises.exerciseId, exerciseId))
      .orderBy(desc(sessionExercises.completedAt))
      .limit(limit)
      .then((rows) => {
        if (active) {
          setAttempts(rows);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [exerciseId, limit]);

  return { attempts, loading };
}
