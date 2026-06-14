import { eq } from 'drizzle-orm';

import { getDatabase } from '@/db/client';
import { sessionExercises, sessions } from '@/db/schema';
import { generateId } from '@/lib/id';

export async function startSession(): Promise<string> {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = generateId();

  await db.insert(sessions).values({
    id,
    startedAt: now,
    endedAt: null,
    durationMins: null,
    location: null,
    overallNotes: null,
    mood: null,
    syncStatus: 'pending',
    remoteId: null,
    updatedAt: now,
  });

  return id;
}

export async function addSessionExercise(input: {
  sessionId: string;
  exerciseId: string;
  orderIndex: number;
  resultValue: number | null;
  resultNotes?: string | null;
  durationSecs?: number | null;
}): Promise<void> {
  const db = getDatabase();

  await db.insert(sessionExercises).values({
    id: generateId(),
    sessionId: input.sessionId,
    exerciseId: input.exerciseId,
    orderIndex: input.orderIndex,
    resultValue: input.resultValue,
    resultNotes: input.resultNotes ?? null,
    durationSecs: input.durationSecs ?? null,
    completedAt: new Date().toISOString(),
    syncStatus: 'pending',
    remoteId: null,
  });
}

export async function finishSession(input: {
  id: string;
  durationMins: number;
  overallNotes: string | null;
  mood: number | null;
}): Promise<void> {
  const db = getDatabase();
  const now = new Date().toISOString();

  await db
    .update(sessions)
    .set({
      endedAt: now,
      durationMins: input.durationMins,
      overallNotes: input.overallNotes,
      mood: input.mood,
      updatedAt: now,
    })
    .where(eq(sessions.id, input.id));
}
