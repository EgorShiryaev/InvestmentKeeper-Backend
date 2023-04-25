import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import RefillsDatasource from './refills_datasource';

const RefillsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): RefillsDatasource => {
  const table = TableTitle.refills;
  return {
    create: ({ accountId, value }) => {
      const script = `INSERT INTO ${table} (accountId, value)
        VALUES(${accountId}, ${value})  
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default RefillsLocalDatasource;
