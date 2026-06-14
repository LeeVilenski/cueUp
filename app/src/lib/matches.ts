import { eq } from 'drizzle-orm';

import { getDatabase } from '@/db/client';
import { breakLogs, matchFrames, matches, type BreakContext, type MatchResult } from '@/db/schema';
import { recomputePersonalBests } from '@/lib/break-logs';
import { generateId } from '@/lib/id';

export type NewMatchFrameInput = {
  playerScore: number;
  opponentScore: number;
  playerHighBreak?: number | null;
  opponentHighBreak?: number | null;
};

export async function addMatch(input: {
  opponentName: string;
  isLeague: boolean;
  result: MatchResult;
  framesWon?: number | null;
  framesLost?: number | null;
  notes?: string | null;
  frames?: NewMatchFrameInput[];
}): Promise<{ id: string }> {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = generateId();
  const frames = input.frames ?? [];

  await db.insert(matches).values({
    id,
    opponentName: input.opponentName.trim(),
    isLeague: input.isLeague,
    result: input.result,
    framesWon: input.framesWon ?? null,
    framesLost: input.framesLost ?? null,
    playedAt: now,
    notes: input.notes?.trim() ? input.notes.trim() : null,
    syncStatus: 'pending',
    remoteId: null,
    updatedAt: now,
  });

  if (frames.length > 0) {
    await db.insert(matchFrames).values(
      frames.map((frame, index) => ({
        id: generateId(),
        matchId: id,
        frameNumber: index + 1,
        playerScore: frame.playerScore,
        opponentScore: frame.opponentScore,
        playerHighBreak: frame.playerHighBreak ?? null,
        opponentHighBreak: frame.opponentHighBreak ?? null,
        syncStatus: 'pending' as const,
        remoteId: null,
      })),
    );
  }

  const context: BreakContext = input.isLeague ? 'league' : 'match';
  const playerBreaks = frames
    .map((frame) => frame.playerHighBreak)
    .filter((value): value is number => value != null && value > 0);

  if (playerBreaks.length > 0) {
    await db.insert(breakLogs).values(
      playerBreaks.map((score) => ({
        id: generateId(),
        score,
        context,
        sessionId: null,
        matchId: id,
        achievedAt: now,
        notes: null,
        isPersonalBest: false,
        syncStatus: 'pending' as const,
        remoteId: null,
        updatedAt: now,
      })),
    );
    await recomputePersonalBests();
  }

  return { id };
}

export async function deleteMatch(id: string): Promise<void> {
  const db = getDatabase();
  await db.delete(matches).where(eq(matches.id, id));
  await recomputePersonalBests();
}
