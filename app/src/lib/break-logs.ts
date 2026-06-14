import { eq, sql } from 'drizzle-orm';

import { getDatabase } from '@/db/client';
import { breakLogs, type BreakContext } from '@/db/schema';
import { generateId } from '@/lib/id';

export async function addBreakLog(input: {
  score: number;
  context: BreakContext;
  notes?: string;
  sessionId?: string | null;
}): Promise<{ id: string; isNewPersonalBest: boolean }> {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = generateId();

  const [previous] = await db.select({ max: sql<number | null>`max(score)` }).from(breakLogs);
  const previousBest = previous?.max ?? null;

  await db.insert(breakLogs).values({
    id,
    score: input.score,
    context: input.context,
    sessionId: input.sessionId ?? null,
    achievedAt: now,
    notes: input.notes?.trim() ? input.notes.trim() : null,
    isPersonalBest: false,
    syncStatus: 'pending',
    remoteId: null,
    updatedAt: now,
  });

  await recomputePersonalBests();

  return { id, isNewPersonalBest: previousBest == null || input.score >= previousBest };
}

export async function deleteBreakLog(id: string): Promise<void> {
  const db = getDatabase();
  await db.delete(breakLogs).where(eq(breakLogs.id, id));
  await recomputePersonalBests();
}

async function recomputePersonalBests(): Promise<void> {
  const db = getDatabase();
  await db.update(breakLogs).set({ isPersonalBest: false });
  const [row] = await db.select({ max: sql<number | null>`max(score)` }).from(breakLogs);
  if (row?.max != null) {
    await db.update(breakLogs).set({ isPersonalBest: true }).where(eq(breakLogs.score, row.max));
  }
}
