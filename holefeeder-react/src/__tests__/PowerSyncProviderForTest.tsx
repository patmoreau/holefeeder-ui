import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { PowerSyncProvider } from '@/contexts/PowersyncProvider';

export const PowerSyncProviderForTest = ({ db, children }: { db: AbstractPowerSyncDatabase; children: React.ReactNode }) => {
  return <PowerSyncProvider db={db}>{children}</PowerSyncProvider>;
};
