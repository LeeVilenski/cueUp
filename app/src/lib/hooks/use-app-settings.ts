import { useEffect, useState } from 'react';

import { getDatabase } from '@/db/client';
import { appSettings, type AppSettings } from '@/db/schema';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDatabase()
      .select()
      .from(appSettings)
      .limit(1)
      .then((rows) => {
        if (active) {
          setSettings(rows[0] ?? null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}
