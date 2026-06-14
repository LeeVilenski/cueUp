import { useCallback, useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { appSettings, type AppSettings } from '@/db/schema';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await getDatabase().select().from(appSettings).limit(1);
    setSettings(rows[0] ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, refresh };
}
