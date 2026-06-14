import { desc } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { breakLogs, type BreakLog } from '@/db/schema';

export function useBreakLogs() {
  const [data, setData] = useState<BreakLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await getDatabase().select().from(breakLogs).orderBy(desc(breakLogs.achievedAt));
    setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { breakLogs: data, loading, refresh };
}
