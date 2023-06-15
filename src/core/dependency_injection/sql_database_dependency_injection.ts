import createTables from '../../data/databases/create_tables';
import SqlDatabase from '../../data/databases/sql_database';
import SqlDatabaseImpl from '../../data/databases/sql_database_impl';

const sqlDatabaseDependencyInjection = async (): Promise<SqlDatabase> => {
  const sqlDatabase = await SqlDatabaseImpl();

  await createTables(sqlDatabase);

  return sqlDatabase;
};

export default sqlDatabaseDependencyInjection;

