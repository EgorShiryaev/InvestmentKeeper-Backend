import SqlDatabase from './sql_database';
import TableTitle from './table_title';

const createTables = async (sqlDatabase: SqlDatabase) => {
  const createTable = (tableConfig: string) => {
    return sqlDatabase.createTable(`CREATE TABLE IF NOT EXISTS ${tableConfig}`);
  };

  const IdColumnConfig = 'id SERIAL PRIMARY KEY';

  const tablesConfigs = {
    users: `
    ${TableTitle.users} (
      ${IdColumnConfig}, 
      name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(16) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `,
    accounts: `
    ${TableTitle.accounts} (
      ${IdColumnConfig},
      user_id INTEGER NOT NULL,
      currency_id INTEGER NOT NULL,
      title VARCHAR(25) NOT NULL,
      FOREIGN KEY (user_id)
        REFERENCES ${TableTitle.users} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (currency_id)
        REFERENCES ${TableTitle.currencies} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    currencyDeposits: `
    ${TableTitle.currencyDeposits} (
      ${IdColumnConfig},
      account_id INTEGER NOT NULL,
      currency_id INTEGER NOT NULL,
      value_units INTEGER NOT NULL DEFAULT 0,
      value_nano INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (currency_id)
        REFERENCES ${TableTitle.currencies} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    financialOperations: `
    ${TableTitle.financialOperations} (
      ${IdColumnConfig},
      account_id INTEGER NOT NULL,
      currency_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      value_units INTEGER NOT NULL,
      value_nano INTEGER NOT NULL,
      FOREIGN KEY (account_id)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (currency_id)
        REFERENCES ${TableTitle.currencies} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    investmentAssets: `
    ${TableTitle.investAssets} (
      ${IdColumnConfig},
      account_id INTEGER NOT NULL,
      instrument_id INTEGER NOT NULL,
      lots INTEGER NOT NULL DEFAULT 0,
      average_purchase_price_units INTEGER NOT NULL DEFAULT 0,
      average_purchase_price_nano INTEGER NOT NULL DEFAULT 0,
      average_exchange_rate_units DOUBLE PRECISION NOT NULL DEFAULT 1,
      average_exchange_rate_nano DOUBLE PRECISION NOT NULL DEFAULT 0,
      FOREIGN KEY (account_id)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (instrument_id)
        REFERENCES ${TableTitle.investInstruments} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    tradingOperations: `
    ${TableTitle.tradingOperations} (
      ${IdColumnConfig},
      investment_asset_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      lots INTEGER NOT NULL,
      price_units INTEGER NOT NULL,
      price_nano INTEGER NOT NULL,
      commission_units INTEGER NOT NULL DEFAULT 0,
      commission_nano INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (investment_asset_id)
        REFERENCES ${TableTitle.investAssets} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    currencies: `
    ${TableTitle.currencies} (
      ${IdColumnConfig},
      value VARCHAR(25) NOT NULL 
    )
    `,
    investInstruments: `
    ${TableTitle.investInstruments} (
      ${IdColumnConfig},
      type_id INTEGER NOT NULL,
      currency_id INTEGER NOT NULL,
      figi VARCHAR(12) NOT NULL,
      ticker VARCHAR(12) NOT NULL,
      title VARCHAR(255) NOT NULL,
      lot INTEGER NOT NULL,
      upper_case_figi VARCHAR(12) NOT NULL,
      upper_case_ticker VARCHAR(12) NOT NULL,
      upper_case_title VARCHAR(255) NOT NULL,
      FOREIGN KEY (type_id)
        REFERENCES ${TableTitle.investInstrumentTypes} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (currency_id)
        REFERENCES ${TableTitle.currencies} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    investInstrumentTypes: `
    ${TableTitle.investInstrumentTypes} (
      ${IdColumnConfig}, 
      value VARCHAR(25) NOT NULL
    )
    `,
  };

  const create = async () => {
    await Promise.all([
      createTable(tablesConfigs.users),
      createTable(tablesConfigs.investInstrumentTypes),
      createTable(tablesConfigs.currencies),
    ]);
    await createTable(tablesConfigs.accounts);
    await Promise.all([
      createTable(tablesConfigs.currencyDeposits),
      createTable(tablesConfigs.financialOperations),
      createTable(tablesConfigs.investInstruments),
    ]);
    await createTable(tablesConfigs.investmentAssets);
    await createTable(tablesConfigs.tradingOperations);
  };

  await create();
};

export default createTables;

