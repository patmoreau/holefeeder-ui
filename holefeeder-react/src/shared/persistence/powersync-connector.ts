import { AbstractPowerSyncDatabase, type PowerSyncBackendConnector } from '@powersync/common';
import { config } from '@/config/config';
import { syncApi } from '@/shared/api/sync-api';

export const PowerSyncConnector = (getToken: () => Promise<{ token: string; expiresAt?: number } | null>): PowerSyncBackendConnector => {
  const fetchCredentials = async () => {
    const token = await getToken();
    if (!token) {
      return null;
    }
    return {
      endpoint: config.powersync.url,
      token: token.token,
      expiresAt: token.expiresAt ? new Date(token.expiresAt) : undefined,
    };
  };

  const uploadData = async (database: AbstractPowerSyncDatabase): Promise<void> => {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) {
      return;
    }

    const token = await getToken();
    if (!token) {
      throw new Error('No auth token available for upload');
    }

    await syncApi(token.token).upload({
      transactionId: transaction.transactionId ? Number(transaction.transactionId) : undefined,
      operations: transaction.crud,
    });

    await transaction.complete();
  };

  return { fetchCredentials: fetchCredentials, uploadData: uploadData };
};
