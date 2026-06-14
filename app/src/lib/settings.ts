import { eq } from 'drizzle-orm';

import { getDatabase } from '@/db/client';
import { appSettings, type BreakContext } from '@/db/schema';

export async function updateSettings(input: {
  playerName: string | null;
  defaultSessionDurationMins: number;
  quickLogDefaultContext: BreakContext;
  weeklySessionGoal: number;
}): Promise<void> {
  const db = getDatabase();
  await db.update(appSettings).set(input).where(eq(appSettings.id, 1));
}
