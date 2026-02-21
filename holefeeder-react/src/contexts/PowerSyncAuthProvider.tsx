import { PowerSyncContext } from '@powersync/react-native';
import { ReactNode, useEffect, useState } from 'react';
import { db } from '@/domain/persistence/db';
import { PowerSyncConnector } from '@/domain/persistence/powersync-connector';
import { useAuth } from '@/shared/hooks/use-auth';

export const PowerSyncAuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const { getCredentials, user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const getToken = async () => {
      try {
        const credentials = await getCredentials();
        return credentials ? { token: credentials.accessToken, expiresAt: credentials.expiresAt } : null;
      } catch (e) {
        console.error('Token fetch failed', e);
        return null;
      }
    };

    db.waitForStatus((status) => {
      if (status.connected && status.connecting) {
        console.error('PowerSyncAuthProvider - status: ', status.toJSON());
      }
    });

    const init = async () => {
      if (db.currentStatus.connected) {
        await db.disconnect();
      }

      if (user && isMounted) {
        await db.init();
        await db.connect(PowerSyncConnector(getToken));
        setInitialized(true);
      } else if (!user && isMounted) {
        await db.disconnectAndClear();
      }
    };

    init();

    return () => {
      isMounted = false;
      db.disconnect();
    };
  }, [getCredentials, user]);

  if (!initialized) {
    return null; // Or a loading spinner
  }

  return <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>;
};
