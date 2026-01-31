import { useStatus } from '@powersync/react-native';

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
  const status = useStatus();

  return {
    connected: status.connected ?? false,
    lastSyncedAt: status?.lastSyncedAt ?? null,
    dataFlowStatus: status?.dataFlowStatus
      ? { downloading: status.dataFlowStatus.downloading ?? false, uploading: status.dataFlowStatus.uploading ?? false }
      : { downloading: false, uploading: false },
  };
}
