import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import WithdrawalsDatasource from './withdrawals_datasource';

const WithdrawalsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): WithdrawalsDatasource => {
  const table = TableTitle.withdrawals;
  return {
    create: ({ accountId, value }) => {
      const script = `INSERT INTO ${table} (accountId, value)
        VALUES(${accountId}, ${value})  
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default WithdrawalsLocalDatasource;

