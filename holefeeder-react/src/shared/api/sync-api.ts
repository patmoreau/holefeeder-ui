import { CrudEntry } from '@powersync/common';
import { apiService } from '@/shared/api/api-service';

type SyncUploadApi = {
  transaction_id?: number;
  operations: CrudEntry[];
};

export const syncApi = (token: string | null) => {
  const api = apiService(token);

  const upload = ({ transactionId, operations }: { transactionId?: number; operations: CrudEntry[] }): Promise<void> => {
    const payload: SyncUploadApi = {
      transaction_id: transactionId,
      operations: operations,
    };
    return api.postWithAuth<SyncUploadApi>('/api/v2/sync/powersync', payload);
  };

  return {
    upload,
  };
};
