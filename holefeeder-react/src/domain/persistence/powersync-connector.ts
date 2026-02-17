import { AbstractPowerSyncDatabase, type PowerSyncBackendConnector } from '@powersync/common';
import { config } from '@/config/config';
import { syncApi } from '@/shared/api/sync-api';

export class PowerSyncConnector implements PowerSyncBackendConnector {
  constructor(private getToken: () => Promise<string | null>) {}

  async fetchCredentials() {
    const token = await this.getToken();
    if (!token) {
      return null;
    }

    return {
      endpoint: config.powersync.url,
      token: token,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) {
      return;
    }

    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No auth token available for upload');
      }

      // console.debug(
      //   'uploadData',
      //   JSON.stringify({
      //     transaction_id: transaction.transactionId,
      //     operations: transaction.crud,
      //   })
      // );

      await syncApi(token).upload({
        transactionId: transaction.transactionId ? Number(transaction.transactionId) : undefined,
        operations: transaction.crud,
      });

      await transaction.complete();
    } catch (error) {
      // console.error('Upload failed:', error);
      // PowerSync will automatically retry if we don't complete the transaction
      // Throwing the error ensures PowerSync knows it failed
      throw error;
    }
  }
}
