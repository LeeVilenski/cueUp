import { asc, eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { exercises, type Exercise } from '@/db/schema';

export function useExercises() {
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDatabase()
      .select()
      .from(exercises)
      .orderBy(asc(exercises.sortOrder))
      .then((rows) => {
        if (active) {
          setData(rows);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { exercises: data, loading };
}

export function useExercise(id: string | undefined) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setExercise(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getDatabase()
      .select()
      .from(exercises)
      .where(eq(exercises.id, id))
      .limit(1)
      .then((rows) => {
        if (active) {
          setExercise(rows[0] ?? null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { exercise, loading };
}
