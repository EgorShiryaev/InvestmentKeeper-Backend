import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import AccountItemsDatasource from './account_items_datasource';
import AccountItemFullModel from '../../models/account_item_full_model';
import AccountItemModel from '../../models/account_item_model';

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
      ${table}.averagePrice AS "accountItemAveragePrice",
      ${investInstrumentsTable}.id AS "instrumentId",
      ${investInstrumentsTable}.figi AS "instrumentFigi",
      ${investInstrumentsTable}.ticker AS "instrumentTicker",
      ${investInstrumentsTable}.title AS "instrumentTitle",
      ${investInstrumentsTable}.lot AS "instrumentLot",
      ${investInstrumentsTable}.about AS "instrumentAbout",
      ${investInstrumentTypesTable}.value AS "instrumentType",
      ${currenciesTable}.value AS "instrumentCurrency"
      FROM ${table}
      JOIN ${investInstrumentsTable} ON ${table}.instrumentId = ${investInstrumentsTable}.id
      JOIN ${investInstrumentTypesTable} On ${investInstrumentsTable}.typeId = ${investInstrumentTypesTable}.id
      JOIN ${currenciesTable} On ${investInstrumentsTable}.currencyId = ${currenciesTable}.id
      WHERE accountId = ${accountId} AND accountItemLots > 0`;

      return sqlDatabase.getAll<AccountItemFullModel>(script);
    },
    getByAccountIdAndInstrumentId: (accountId, instrumentId) => {
      const script = `SELECT * FROM ${table}
        WHERE  accountId = ${accountId} AND instrumentId = ${instrumentId}
      `;

      return sqlDatabase.get<AccountItemModel>(script);
    },
    create: ({ accountId, instrumentId }) => {
      const script = `INSERT INTO ${table} (accountId, instrumentId)
        VALUES(${accountId}, ${instrumentId})
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
    update: ({ id, lots, averagePrice }) => {
      const setFields = [
        `lots = ${lots}`,
        averagePrice !== null &&
          averagePrice !== undefined &&
          `averagePrice = ${averagePrice}`,
      ];
      const set = setFields.filter((v) => v).join(', ');
      const script = `UPDATE ${table} SET ${set} WHERE id = ${id}`;

      return sqlDatabase.run(script).then((v) => v.changes);
    },
  };
};

export default AccountItemsLocalDatasource;

