import { usePowerSync } from '@powersync/react-native';
import React, { ReactNode, useEffect } from 'react';
import { PowerSyncConnector } from '@/domain/persistence/powersync-connector';
import { useAuth } from '@/shared/hooks/use-auth';

export const PowerSyncConnection = ({ children }: { children: ReactNode }) => {
  const powerSync = usePowerSync();
  const { getCredentials, user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const initSync = async () => {
      // 1. Wait for any pending operations to finish
      if (powerSync.connected) {
        await powerSync.disconnect();
      }

      if (user && isMounted) {
        // 2. Create Connector
        const connector = new PowerSyncConnector(async () => {
          try {
            const creds = await getCredentials();
            return creds?.accessToken ?? null;
          } catch (e) {
            console.error('Token fetch failed', e);
            return null;
          }
        });

        // 3. Explicit Connect
        try {
          await powerSync.connect(connector);
        } catch (e) {
          console.error('Connection failed', e);
        }
      } else if (!user && isMounted) {
        // 4. Logout: Clear data explicitly
        await powerSync.disconnectAndClear();
      }
    };

    initSync();

    return () => {
      isMounted = false;
      // Just disconnect on unmount, don't clear
      powerSync.disconnect();
    };
  }, [user, powerSync]); // Only re-run if User or DB instance changes

  return <>{children}</>;
};
