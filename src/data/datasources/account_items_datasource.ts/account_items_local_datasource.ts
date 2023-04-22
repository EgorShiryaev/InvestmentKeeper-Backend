import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import AccountItemsDatasource from './account_items_datasource';
import AccountItemFullModel from '../../models/account_item_full_model';

const AccountItemsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): AccountItemsDatasource => {
  const table = TableTitle.accountItems;

  return {
    getAllByAccountId: (accountId) => {
      const investInstrumentsTable = TableTitle.investInstruments;
      const investInstrumentTypesTable = TableTitle.investInstrumentTypes;
      const currenciesTable = TableTitle.currencies;

      const script = `SELECT 
      ${table}.id, 
      ${table}.lots, 
      ${table}.averagePrice,
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
      WHERE accountId = ${accountId}`;

      return sqlDatabase
        .getAll<AccountItemFullModel>(script)
        .then((v) => v as AccountItemFullModel[]);
    },
  };
};

export default AccountItemsLocalDatasource;

