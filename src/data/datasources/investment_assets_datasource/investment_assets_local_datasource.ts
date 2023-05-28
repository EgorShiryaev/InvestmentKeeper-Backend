import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import InvestmentAssetsDatasource from './investment_assets_datasource';

const InvestmentAssetsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): InvestmentAssetsDatasource => {
  const table = TableTitle.investmentAssets;

  return {
    getAllByAccountIdAndLotsGreaterZero: (accountId) => {
      const investInstrumentsTable = TableTitle.investInstruments;
      const investInstrumentTypesTable = TableTitle.investInstrumentTypes;
      const currenciesTable = TableTitle.currencies;

      const script = `SELECT 
      ${table}.id AS "investmentAssetId", 
      ${table}.lots AS "investmentAssetLots", 
      ${table}.averagePurchasePrice AS "investmentAssetAveragePurchasePrice",
      ${table}.averageExchangeRate AS "investmentAssetAverageExchangeRate",
      ${investInstrumentsTable}.id AS "instrumentId",
      ${investInstrumentsTable}.figi AS "instrumentFigi",
      ${investInstrumentsTable}.ticker AS "instrumentTicker",
      ${investInstrumentsTable}.title AS "instrumentTitle",
      ${investInstrumentsTable}.lot AS "instrumentLot",
      ${investInstrumentTypesTable}.value AS "instrumentType",
      ${currenciesTable}.value AS "instrumentCurrency"
      FROM ${table}
      JOIN ${investInstrumentsTable} ON ${table}.instrumentId = ${investInstrumentsTable}.id
      JOIN ${investInstrumentTypesTable} On ${investInstrumentsTable}.typeId = ${investInstrumentTypesTable}.id
      JOIN ${currenciesTable} On ${investInstrumentsTable}.currencyId = ${currenciesTable}.id
      WHERE accountId = ${accountId} AND investmentAssetLots > 0
      ORDER BY instrumentTitle ASC`;

      return sqlDatabase.getAll(script);
    },
    getByAccountIdAndInstrumentId: (accountId, instrumentId) => {
      const script = `SELECT * FROM ${table}
        WHERE  accountId = ${accountId} AND instrumentId = ${instrumentId}
      `;

      return sqlDatabase.get(script);
    },
    create: ({ accountId, instrumentId }) => {
      const script = `INSERT INTO ${table} (accountId, instrumentId)
        VALUES(${accountId}, ${instrumentId})
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
    update: ({ id, lots, averagePurchasePrice, averageExchangeRate }) => {
      const setFields = [
        `lots = ${lots}`,
        averagePurchasePrice !== null &&
          averagePurchasePrice !== undefined &&
          `averagePurchasePrice = ${averagePurchasePrice}`,
        averageExchangeRate !== null &&
          averageExchangeRate !== undefined &&
          `averageExchangeRate = ${averageExchangeRate}`,
      ];
      const set = setFields.filter((v) => v).join(', ');
      const script = `UPDATE ${table} SET ${set} WHERE id = ${id}`;

      return sqlDatabase.run(script).then((v) => v.changes);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table} WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
  };
};

export default InvestmentAssetsLocalDatasource;

