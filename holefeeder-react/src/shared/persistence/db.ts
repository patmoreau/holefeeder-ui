import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase } from '@powersync/react-native';
import { AppSchema } from '@/shared/persistence/app-schema';

let instance: PowerSyncDatabase | undefined;

export const getDatabase = (): PowerSyncDatabase => {
  if (instance) {
    return instance;
  }

  const opSqlite = new OPSqliteOpenFactory({
    dbFilename: 'holefeeder.db',
  });

  instance = new PowerSyncDatabase({
    schema: AppSchema,
    database: opSqlite,
  });

  return instance;
};
