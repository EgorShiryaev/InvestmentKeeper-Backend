import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import CurrenciesDatasource from './currencies_datasource';

const CurrenciesLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): CurrenciesDatasource => {
  const table = TableTitle.currencies;

  return {
    get: ({ value }) => {
      const script = `SELECT * FROM ${table} WHERE value = '${value}'`;

      return sqlDatabase.get(script);
    },
  };
};

export default CurrenciesLocalDatasource;

