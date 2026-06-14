import { asc } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { tips, type Tip } from '@/db/schema';

export function useTips() {
  const [data, setData] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDatabase()
      .select()
      .from(tips)
      .orderBy(asc(tips.sortOrder))
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

  return { tips: data, loading };
}
