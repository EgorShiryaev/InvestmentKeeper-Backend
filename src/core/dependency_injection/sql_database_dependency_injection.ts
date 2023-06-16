import createTables from '../../data/databases/create_tables';
import importRequiredData from '../../data/databases/import_required_data';
import SqlDatabase from '../../data/databases/sql_database';
import SqlDatabaseImpl, {
  SqlDatabaseImplParams,
} from '../../data/databases/sql_database_impl';

const sqlDatabaseDependencyInjection = async (
  params: SqlDatabaseImplParams,
): Promise<SqlDatabase> => {
  const sqlDatabase = await SqlDatabaseImpl(params);

  await createTables(sqlDatabase);

  await importRequiredData(sqlDatabase);

  return sqlDatabase;
};

export default sqlDatabaseDependencyInjection;

