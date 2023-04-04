import createTables from '../../../core/utils/create_tables';
import SqlDatabaseImpl from '../../../data/databases/sql_database_impl';
import { SqlDatabase } from '../../../data/databases/types';

const sqlDatabaseDependencyInjection = async (
  dbPath: string,
): Promise<SqlDatabase> => {
  const sqlDatabase = SqlDatabaseImpl({
    databasePath: dbPath,
  });

  await createTables(sqlDatabase);

  return sqlDatabase;
};

export default sqlDatabaseDependencyInjection;

