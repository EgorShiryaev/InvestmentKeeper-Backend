import TableTitle from '../../databases/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import InvestInstrumentsDatasource from './invest_instruments_datasource';

const InvestInstrumentsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): InvestInstrumentsDatasource => {
  const table = TableTitle.investInstruments;

  return {
    getAllLikeTitleOrTickerOrFigi: (value) => {
      const investInstrumentTypesTable = TableTitle.investInstrumentTypes;
      const currenciesTable = TableTitle.currencies;

      const upperCaseValue = value.toUpperCase();

      const likePattern = `'%${upperCaseValue}%'`;

      const titleLike = `upper_case_figi LIKE ${likePattern}`;
      const tickerLike = `upper_case_ticker LIKE ${likePattern}`;
      const figiLike = `upper_case_title LIKE ${likePattern}`;

      const script = `SELECT 
        ${table}.id AS "instrument_id",
        ${table}.figi AS "instrument_figi",
        ${table}.ticker AS "instrument_ticker",
        ${table}.title AS "instrument_title",
        ${table}.lot AS "instrument_lot",
        ${investInstrumentTypesTable}.value AS "instrument_type",
        ${currenciesTable}.value AS "instrument_currency"
        FROM ${table}
        JOIN ${investInstrumentTypesTable} On ${table}.type_id = ${investInstrumentTypesTable}.id
        JOIN ${currenciesTable} On ${table}.currency_id = ${currenciesTable}.id
        WHERE (${titleLike} 
            OR ${tickerLike}
            OR ${figiLike})
        ORDER BY CASE 
            WHEN ${titleLike} AND ${tickerLike} AND ${figiLike} THEN 1
            WHEN ${titleLike} AND ${tickerLike} THEN 2
            WHEN ${titleLike} AND ${figiLike} THEN 3
            WHEN ${titleLike} THEN 4
            WHEN ${tickerLike} THEN 5
            WHEN ${figiLike} THEN 6
            ELSE 7
        END
        `;

      return sqlDatabase.getAll(script);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table}
      WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
  };
};

export default InvestInstrumentsLocalDatasource;

