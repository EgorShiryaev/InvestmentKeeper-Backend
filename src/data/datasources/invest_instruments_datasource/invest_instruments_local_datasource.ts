import TableTitle from '../../databases/types/table_title';
import InvestInstrumentFullModel from '../../models/invest_instrument_full_model';
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

      const likePattern = `"%${upperCaseValue}%"`;

      const titleLike = `UPPER(instrumentTitle) LIKE ${likePattern}`;
      const tickerLike = `UPPER(instrumentTicker) LIKE ${likePattern}`;
      const figiLike = `UPPER(instrumentFigi) LIKE ${likePattern}`;

      const script = `SELECT 
        ${table}.id AS "instrumentId",
        ${table}.figi AS "instrumentFigi",
        ${table}.ticker AS "instrumentTicker",
        ${table}.title AS "instrumentTitle",
        ${table}.lot AS "instrumentLot",
        ${table}.about AS "instrumentAbout",
        ${investInstrumentTypesTable}.value AS "instrumentType",
        ${currenciesTable}.value AS "instrumentCurrency"
        FROM ${table}
        JOIN ${investInstrumentTypesTable} On ${table}.typeId = ${investInstrumentTypesTable}.id
        JOIN ${currenciesTable} On ${table}.currencyId = ${currenciesTable}.id
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

      return sqlDatabase.getAll<InvestInstrumentFullModel>(script);
    },
  };
};

export default InvestInstrumentsLocalDatasource;

