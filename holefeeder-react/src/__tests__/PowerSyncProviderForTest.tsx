import { AbstractPowerSyncDatabase, PowerSyncContext } from '@powersync/react-native';
import React from 'react';

export const PowerSyncProviderForTest = ({ db, children }: { db: AbstractPowerSyncDatabase; children: React.ReactNode }) => {
  return <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>;
};
