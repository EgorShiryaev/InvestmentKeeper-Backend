import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import AccountItemsDatasource from './account_items_datasource';

const AccountItemsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): AccountItemsDatasource => {
  const table = TableTitle.accountItems;

  return {
    getAllByAccountIdAndLotsGreaterZero: (accountId) => {
      const investInstrumentsTable = TableTitle.investInstruments;
      const investInstrumentTypesTable = TableTitle.investInstrumentTypes;
      const currenciesTable = TableTitle.currencies;

      const script = `SELECT 
      ${table}.id AS "accountItemId", 
      ${table}.lots AS "accountItemLots", 
      ${table}.averagePurchasePrice AS "accountItemAveragePurchasePrice",
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
      WHERE accountId = ${accountId} AND accountItemLots > 0
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
    update: ({ id, lots, averagePurchasePrice }) => {
      const setFields = [
        `lots = ${lots}`,
        averagePurchasePrice !== null &&
          averagePurchasePrice !== undefined &&
          `averagePurchasePrice = ${averagePurchasePrice}`,
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

export default AccountItemsLocalDatasource;

