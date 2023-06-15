import TableTitle from '../../databases/table_title';
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
      ${table}.id AS "investment_asset_id", 
      ${table}.lots AS "investment_asset_lots", 
      ${table}.average_purchase_price AS "investment_asset_average_purchase_price",
      ${table}.average_exchange_rate AS "investment_asset_average_exchange_rate",
      ${investInstrumentsTable}.id AS "instrument_id",
      ${investInstrumentsTable}.figi AS "instrument_figi",
      ${investInstrumentsTable}.ticker AS "instrument_ticker",
      ${investInstrumentsTable}.title AS "instrument_title",
      ${investInstrumentsTable}.lot AS "instrument_lot",
      ${investInstrumentTypesTable}.value AS "instrument_type",
      ${currenciesTable}.value AS "instrument_currency"
      FROM ${table}
      JOIN ${investInstrumentsTable} ON ${table}.instrument_id = ${investInstrumentsTable}.id
      JOIN ${investInstrumentTypesTable} On ${investInstrumentsTable}.type_id = ${investInstrumentTypesTable}.id
      JOIN ${currenciesTable} On ${investInstrumentsTable}.currency_id = ${currenciesTable}.id
      WHERE account_id = ${accountId} AND investment_assets.lots > 0
      ORDER BY instrument_title ASC`;

      return sqlDatabase.getAll(script);
    },
    getByAccountIdAndInstrumentId: (accountId, instrumentId) => {
      const script = `SELECT * FROM ${table}
        WHERE  account_id = ${accountId} AND instrument_id = ${instrumentId}
      `;

      return sqlDatabase.get(script);
    },
    create: ({ accountId, instrumentId }) => {
      const script = `INSERT INTO ${table} (account_id, instrument_id)
        VALUES(${accountId}, ${instrumentId})
      `;

      return sqlDatabase.create(script);
    },
    update: ({ id, lots, averagePurchasePrice, averageExchangeRate }) => {
      const setFields = [
        `lots = ${lots}`,
        averagePurchasePrice !== null &&
          averagePurchasePrice !== undefined &&
          `average_purchase_price = ${averagePurchasePrice}`,
        averageExchangeRate !== null &&
          averageExchangeRate !== undefined &&
          `average_exchange_rate = ${averageExchangeRate}`,
      ];
      const set = setFields.filter((v) => v).join(', ');
      const script = `UPDATE ${table} SET ${set} WHERE id = ${id}`;

      return sqlDatabase.update(script);
    },
    getById: (id) => {
      const script = `SELECT * FROM ${table} WHERE id = ${id}`;

      return sqlDatabase.get(script);
    },
  };
};

export default InvestmentAssetsLocalDatasource;

