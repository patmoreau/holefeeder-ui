import { usePowerSync } from '@/contexts/PowersyncProvider';

export interface SyncStatusInfo {
  connected: boolean;
  lastSyncedAt: Date | null;
  dataFlowStatus: {
    downloading: boolean;
    uploading: boolean;
  };
  // Note: Precise "number of items synced" is not directly exposed by the standard status object across all versions.
  // We expose the raw status for now.
}

export function useSyncStatus(): SyncStatusInfo {
  const { syncStatus } = usePowerSync();

  return {
    connected: syncStatus?.connected ?? false,
    lastSyncedAt: syncStatus?.lastSyncedAt ?? null,
    dataFlowStatus: syncStatus?.dataFlowStatus
      ? { downloading: syncStatus.dataFlowStatus.downloading ?? false, uploading: syncStatus.dataFlowStatus.uploading ?? false }
      : { downloading: false, uploading: false },
  };
}
