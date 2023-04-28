import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import RefillsDatasource from './refills_datasource';

const RefillsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): RefillsDatasource => {
  const table = TableTitle.refills;
  return {
    create: ({ accountId, value, date }) => {
      const dateValue = date ?? new Date().toISOString();
      const script = `INSERT INTO ${table} (accountId, value, date)
        VALUES(${accountId}, ${value}, "${dateValue}")  
      `;
      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default RefillsLocalDatasource;

