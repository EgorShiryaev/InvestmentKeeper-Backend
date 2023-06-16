import SqlDatabase from './sql_database';
import currenciesData from './resources/currencies.json';
import investInstrumentTypesData from './resources/investInstrumentTypes.json';
import investInstrumentsData from './resources/investInstruments.json';
import TableTitle from './table_title';
import BaseModel from '../models/base_model';

const importRequiredData = async (sqlDatabase: SqlDatabase) => {
  const checkCurrenciesTable = () => {
    return sqlDatabase.get<BaseModel>(`SELECT * FROM ${TableTitle.currencies}`);
  };

  const importCurrencies = () => {
    const values = currenciesData.map((v) => `('${v.value}')`).join(', ');
    const script = `INSERT INTO ${TableTitle.currencies} (value) VALUES ${values}`;
    sqlDatabase.create(script);
  };

  const checkInvestInstrumentTypesTable = () => {
    return sqlDatabase.get<BaseModel>(
      `SELECT * FROM ${TableTitle.investInstrumentTypes}`,
    );
  };

  const importTypes = () => {
    const values = investInstrumentTypesData
      .map((v) => `('${v.value}')`)
      .join(', ');
    const script = `INSERT INTO ${TableTitle.investInstrumentTypes} (value) VALUES ${values}`;
    sqlDatabase.create(script);
  };

  const checkInstruments = () => {
    return sqlDatabase.get<BaseModel>(
      `SELECT * FROM ${TableTitle.investInstruments}`,
    );
  };

  const importInstruments = () => {
    const values = investInstrumentsData
      .map(
        (v) =>
          `(${v.typeId}, ${v.currencyId}, '${v.figi}', '${v.ticker}', '${v.title}', ${v.lot})`,
      )
      .join(', ');
    const script = `INSERT INTO ${TableTitle.investInstruments} (type_id,currency_id, figi, ticker, title, lot) VALUES ${values}`;
    sqlDatabase.create(script);
  };

  await Promise.all([
    checkCurrenciesTable().then((model) => !model && importCurrencies()),
    checkInvestInstrumentTypesTable().then((model) => !model && importTypes()),
  ]);
  await checkInstruments().then((model) => !model && importInstruments());
};

export default importRequiredData;

