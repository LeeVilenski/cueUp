import { asc, desc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { matchFrames, matches, type Match, type MatchFrame } from '@/db/schema';

export function useMatches() {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await getDatabase().select().from(matches).orderBy(desc(matches.playedAt));
    setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { matches: data, loading, refresh };
}

export function useMatch(id: string | undefined) {
  const [match, setMatch] = useState<Match | null>(null);
  const [frames, setFrames] = useState<MatchFrame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setMatch(null);
      setFrames([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    const db = getDatabase();

    Promise.all([
      db.select().from(matches).where(eq(matches.id, id)).limit(1),
      db.select().from(matchFrames).where(eq(matchFrames.matchId, id)).orderBy(asc(matchFrames.frameNumber)),
    ]).then(([matchRows, frameRows]) => {
      if (active) {
        setMatch(matchRows[0] ?? null);
        setFrames(frameRows);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [id]);

  return { match, frames, loading };
}
