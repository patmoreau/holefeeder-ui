import { AbstractPowerSyncDatabase, PowerSyncBackendConnector } from '@powersync/react-native';
import { config } from '@/config/config';

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

  async uploadData(_database: AbstractPowerSyncDatabase): Promise<void> {
    // Implement upload logic if you have write operations
    // e.g., await database.getAll('SELECT * FROM oplog ...');
    // For read-only or simple sync, this might be handled automatically or via API calls
    return;
  }
}
