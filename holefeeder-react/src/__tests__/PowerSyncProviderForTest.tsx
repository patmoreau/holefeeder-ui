import { AbstractPowerSyncDatabase, PowerSyncContext } from '@powersync/react-native';
import React from 'react';
import { RepositoryProvider } from '@/contexts/RepositoryContext';

export const PowerSyncProviderForTest = ({ db, children }: { db: AbstractPowerSyncDatabase; children: React.ReactNode }) => {
  return (
    <PowerSyncContext.Provider value={db}>
      <RepositoryProvider>{children}</RepositoryProvider>
    </PowerSyncContext.Provider>
  );
};
