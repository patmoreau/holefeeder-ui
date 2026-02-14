import { usePowerSync } from '@powersync/react-native';
import React, { ReactNode, useEffect, useRef } from 'react';
import { PowerSyncConnector } from '@/domain/persistence/powersync-connector';
import { useAuth } from '@/shared/hooks/use-auth';

export const PowerSyncConnection = ({ children }: { children: ReactNode }) => {
  const powerSync = usePowerSync();
  const { getCredentials } = useAuth();

  // Use a ref to access the current getCredentials without re-triggering effects
  const getCredentialsRef = useRef(getCredentials);

  useEffect(() => {
    getCredentialsRef.current = getCredentials;
  }, [getCredentials]);

  useEffect(() => {
    const connector = new PowerSyncConnector(async () => {
      const creds = await getCredentialsRef.current();
      return creds?.accessToken ?? null;
    });

    powerSync.connect(connector);

    return () => {
      powerSync.disconnect();
    };
  }, [powerSync]);

  return <>{children}</>;
};
