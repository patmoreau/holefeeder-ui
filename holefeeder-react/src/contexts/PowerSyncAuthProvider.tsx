import { PowerSyncContext } from '@powersync/react-native';
import { ReactNode, useEffect, useState } from 'react';
import { getDatabase } from '@/domain/persistence/db';
import { PowerSyncConnector } from '@/domain/persistence/powersync-connector';
import { useAuth } from '@/shared/hooks/use-auth';

export const PowerSyncAuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const { getCredentials, user, isLoading: authLoading } = useAuth();
  const db = getDatabase();

  useEffect(() => {
    if (authLoading) return;

    const getToken = async () => {
      const credentials = await getCredentials();
      return credentials ? { token: credentials.accessToken, expiresAt: credentials.expiresAt } : null;
    };

    if (user) {
      db.init()
        .then(() => db.connect(PowerSyncConnector(getToken)))
        .finally(() => setInitialized(true));
    } else {
      db.disconnect().finally(() => setInitialized(true));
    }
  }, [user?.sub, authLoading]);

  if (!initialized) return null;

  return <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>;
};
