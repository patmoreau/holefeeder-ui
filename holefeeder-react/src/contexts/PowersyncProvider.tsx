import { AbstractPowerSyncDatabase } from '@powersync/common';
import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase, SyncStatus } from '@powersync/react-native';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppSchema } from '@/config/powersync/AppSchema';
import { PowerSyncConnector } from '@/config/powersync/PowerSyncConnector';
import { useAuth } from '@/shared/hooks/use-auth';

type PowerSyncProviderProps = {
  children: ReactNode;
  db?: AbstractPowerSyncDatabase;
};

interface PowerSyncContextType {
  db: AbstractPowerSyncDatabase;
  syncStatus: SyncStatus | null;
}

const PowerSyncContext = createContext<PowerSyncContextType | null>(null);

export const PowerSyncProvider = ({ children, db: externalDb }: PowerSyncProviderProps) => {
  const { getCredentials } = useAuth();

  // Use a ref to access the current getCredentials without re-triggering effects
  const getCredentialsRef = useRef(getCredentials);
  useEffect(() => {
    getCredentialsRef.current = getCredentials;
  }, [getCredentials]);

  const [db] = useState(() => {
    return externalDb ?? createPowersyncDatabase();
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    const connector = new PowerSyncConnector(async () => {
      const creds = await getCredentialsRef.current();
      return creds?.accessToken ?? null;
    });

    db.connect(connector);

    // Listen for status changes
    const listener = db.registerListener({
      statusChanged: (status) => {
        setSyncStatus(status);
      },
    });

    return () => {
      listener?.();
      db.disconnect();
    };
  }, [db]);

  const value = useMemo(() => ({ db, syncStatus }), [db, syncStatus]);

  return <PowerSyncContext.Provider value={value}>{children}</PowerSyncContext.Provider>;
};

export const usePowerSync = () => {
  const context = useContext(PowerSyncContext);
  if (!context) {
    throw new Error('usePowerSync must be used within a PowerSyncProvider');
  }
  return context;
};

const createPowersyncDatabase = () => {
  const opSqlite = new OPSqliteOpenFactory({
    dbFilename: 'holefeeder.db',
  });

  return new PowerSyncDatabase({
    schema: AppSchema,
    database: opSqlite,
  });
};
