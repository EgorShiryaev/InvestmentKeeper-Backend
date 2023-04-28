import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import WithdrawalsDatasource from './withdrawals_datasource';

const WithdrawalsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): WithdrawalsDatasource => {
  const table = TableTitle.withdrawals;
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

export default WithdrawalsLocalDatasource;

