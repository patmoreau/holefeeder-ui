import { AbstractPowerSyncDatabase } from '@powersync/common';
import { PowerSyncContext } from '@powersync/react';
import React from 'react';
import { RepositoryProvider } from '@/contexts/RepositoryContext';

export const PowerSyncProviderForTest = ({ db, children }: { db: AbstractPowerSyncDatabase; children: React.ReactNode }) => {
  return (
    <PowerSyncContext.Provider value={db}>
      <RepositoryProvider>{children}</RepositoryProvider>
    </PowerSyncContext.Provider>
  );
};
