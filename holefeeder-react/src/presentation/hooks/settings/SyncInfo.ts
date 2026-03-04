import { DataMetrics } from '@/domain/core/settings/data-metrics';

export type SyncInfo = {
  connected: boolean;
  lastSyncedAt?: Date;
  dataFlowStatus: {
    downloading: boolean;
    uploading: boolean;
  };
  dataMetrics: DataMetrics;
};
