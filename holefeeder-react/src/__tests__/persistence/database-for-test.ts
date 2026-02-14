import fs from 'fs';
import {
  AbstractPowerSyncDatabase,
  CreateSyncImplementationOptions,
  DBAdapter,
  PowerSyncBackendConnector,
  PowerSyncDatabaseOptionsWithSettings,
  RequiredAdditionalConnectionOptions,
  Schema,
  SqliteBucketStorage,
  StreamingSyncImplementation,
} from '@powersync/react-native';
import Database from 'better-sqlite3';
import { DatabaseAdapterForTest } from '@/__tests__/persistence/database-adapter-for-test';
import { AppSchema } from '@/domain/persistence/app-schema';

export class DatabaseForTest extends AbstractPowerSyncDatabase {
  async _initialize(): Promise<void> {
    return Promise.resolve();
  }

  protected openDBAdapter(options: PowerSyncDatabaseOptionsWithSettings): DBAdapter {
    throw new Error('openDBAdapter not supported in TestDB');
  }

  protected generateBucketStorageAdapter(): SqliteBucketStorage {
    return new SqliteBucketStorage(this.database, this.logger);
  }

  protected generateSyncStreamImplementation(
    connector: PowerSyncBackendConnector,
    options: CreateSyncImplementationOptions & RequiredAdditionalConnectionOptions
  ): StreamingSyncImplementation {
    return {
      connected: false,
      lastSyncedAt: new Date(),
      retryDelayMs: 0,
      waitForConnected: async () => {},
      triggerUpdate: async () => {},
      disconnect: async () => {},
      dispose: async () => {},
      obtainLock: async () => () => {},
    } as unknown as StreamingSyncImplementation;
  }

  async connect() {
    return;
  }

  async cleanupTestDb() {
    try {
      const sqliteDb = (this.database as DatabaseAdapterForTest).dbConnection as Database.Database;
      if (sqliteDb && sqliteDb.open) {
        sqliteDb.close();
      }

      if (typeof this.disconnect === 'function') {
        await this.disconnect();
      }
    } catch {}
  }
}

export const setupDatabaseForTest = async (inMemory: boolean = true) => {
  try {
    if (!inMemory && fs.existsSync('.debug.sqlite')) {
      fs.unlinkSync('.debug.sqlite');
    }
  } catch {}
  const adapter = new DatabaseAdapterForTest(inMemory ? ':memory:' : '.debug.sqlite');

  const db = new DatabaseForTest({
    schema: AppSchema,
    database: adapter,
  });

  await db.init();

  const sqlStatements = generateSqlFromSchema(AppSchema);

  for (const sql of sqlStatements) {
    await adapter.execute(sql);
  }

  return db;
};

const generateSqlFromSchema = (schema: Schema): string[] => {
  const tables: string[] = [];
  const indexes: string[] = [];

  for (const table of schema.tables) {
    const columnDefs = table.columns.map((column) => {
      return `"${column.name}" ${column.type}`;
    });

    columnDefs.unshift('"id" TEXT PRIMARY KEY');

    tables.push(`CREATE TABLE IF NOT EXISTS "${table.name}" (${columnDefs.join(', ')});`);

    if (table.indexes) {
      for (const index of table.indexes) {
        const columns = index.columns;
        const formattedCols = columns.map((c) => `"${c.name}"`).join(', ');

        indexes.push(`CREATE INDEX IF NOT EXISTS "${index.name}" ON "${table.name}" (${formattedCols});`);
      }
    }
  }

  return [...tables, ...indexes];
};
