import { SqlDatabase } from '../../data/databases/types';
import TableTitle from '../../data/databases/types/table_title';

const createTables = async (sqlDatabase: SqlDatabase) => {
  const createTable = (tableConfig: string) => {
    return sqlDatabase.run(`CREATE TABLE IF NOT EXISTS ${tableConfig}`);
  };

  const IdColumnConfig = 'id INTEGER PRIMARY KEY AUTOINCREMENT';

  const tablesConfigs = {
    users: `
    ${TableTitle.users} (
      ${IdColumnConfig}, 
      name VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(16) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `,
    accounts: `
    ${TableTitle.accounts} (
      ${IdColumnConfig},
      userId INTEGER NOT NULL,
      title VARCHAR(25) NOT NULL,
      FOREIGN KEY (userId)
        REFERENCES ${TableTitle.users} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    currencyDeposits: `
    ${TableTitle.currencyDeposits} (
      ${IdColumnConfig},
      accountId INTEGER NOT NULL,
      currencyId INTEGER NOT NULL,
      value DOUBLE NOT NULL DEFAULT 0,
      FOREIGN KEY (currencyId)
        REFERENCES ${TableTitle.currencies} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    financialOperations: `
    ${TableTitle.financialOperations} (
      ${IdColumnConfig},
      accountId INTEGER NOT NULL,
      currencyId INTEGER NOT NULL,
      date TEXT NOT NULL,
      value DOUBLE NOT NULL,
      FOREIGN KEY (accountId)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (currencyId)
        REFERENCES ${TableTitle.currencies} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    investmentAssets: `
    ${TableTitle.investmentAssets} (
      ${IdColumnConfig},
      accountId INTEGER NOT NULL,
      instrumentId INTEGER NOT NULL,
      lots INTEGER NOT NULL DEFAULT 0,
      averagePurchasePrice DOUBLE NOT NULL DEFAULT 0,
      averageExchangeRate DOUBLE NOT NULL DEFAULT 1,
      FOREIGN KEY (accountId)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (instrumentId)
        REFERENCES ${TableTitle.investInstruments} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    tradingOperations: `
    ${TableTitle.tradingOperations} (
      ${IdColumnConfig},
      investmentAssetId INTEGER NOT NULL,
      date TEXT NOT NULL,
      lots INTEGER NOT NULL,
      price DOUBLE NOT NULL,
      commission DOUBLE NOT NULL DEFAULT 0,
      FOREIGN KEY (investmentAssetId)
        REFERENCES ${TableTitle.investmentAssets} (id) 
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
      typeId INTEGER NOT NULL,
      currencyId INTEGER NOT NULL,
      figi VARCHAR(12) NOT NULL,
      ticker VARCHAR(12) NOT NULL,
      title VARCHAR(255) NOT NULL,
      lot INTEGER NOT NULL,
      FOREIGN KEY (typeId)
        REFERENCES ${TableTitle.investInstrumentTypes} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (currencyId)
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

  const create = () => {
    return Promise.all([
      createTable(tablesConfigs.users),
      createTable(tablesConfigs.accounts),
      createTable(tablesConfigs.investInstrumentTypes),
      createTable(tablesConfigs.currencies),
      createTable(tablesConfigs.investInstruments),
      createTable(tablesConfigs.investmentAssets),
      createTable(tablesConfigs.tradingOperations),
      createTable(tablesConfigs.financialOperations),
      createTable(tablesConfigs.currencyDeposits),
    ]);
  };

  await create();
};

export default createTables;

