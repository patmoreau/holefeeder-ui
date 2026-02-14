import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase } from '@powersync/react-native';
import { AppSchema } from '@/domain/persistence/app-schema';

export const createPowersyncDatabase = () => {
  const opSqlite = new OPSqliteOpenFactory({
    dbFilename: 'holefeeder.db',
  });

  return new PowerSyncDatabase({
    schema: AppSchema,
    database: opSqlite,
  });
};

export const db = createPowersyncDatabase();
