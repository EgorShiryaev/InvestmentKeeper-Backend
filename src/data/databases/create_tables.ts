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
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `,
    accounts: `
    ${TableTitle.accounts} (
      ${IdColumnConfig},
      userId INTEGER NOT NULL,
      title VARCHAR(25) NOT NULL, 
      visibility BOOL NOT NULL,
      FOREIGN KEY (userId)
        REFERENCES ${TableTitle.users} (id) 
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
      about TEXT NOT NULL,
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
    instrumentComments: `
    ${TableTitle.instrumentComments} (
      ${IdColumnConfig},
      userId INTEGER NOT NULL,
      instrumentId INTEGER NOT NULL,
      comment TEXT NOT NULL,
      FOREIGN KEY (userId)
        REFERENCES ${TableTitle.users} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (instrumentId)
        REFERENCES ${TableTitle.investInstruments} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )
    `,
    accountItems: `
    ${TableTitle.accountItems} (
      ${IdColumnConfig},
      accountId INTEGER NOT NULL,
      instrumentId INTEGER NOT NULL,
      lots INTEGER NOT NULL,
      averagePrice DOUBLE NOT NULL,
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
    instrumentAccountHistoryItemTypes: `
    ${TableTitle.instrumentAccountHistoryItemTypes} (
      ${IdColumnConfig},
      value VARCHAR(25) NOT NULL
    )`,
    instrumentAccountHistory: `
    ${TableTitle.instrumentAccountHistory} (
      ${IdColumnConfig},
      typeId INTEGER NOT NULL,
      accountId INTEGER NOT NULL,
      instrumentId INTEGER NOT NULL,
      dateTimeUnix INTEGER NOT NULL,
      lots INTEGER NOT NULL,
      price DOUBLE NOT NULL,
      FOREIGN KEY (typeId)
        REFERENCES ${TableTitle.instrumentAccountHistoryItemTypes} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (accountId)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (instrumentId)
        REFERENCES ${TableTitle.investInstruments} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    moneyAccountHistoryItemTypes: `
    ${TableTitle.moneyAccountHistoryItemTypes} (
      ${IdColumnConfig},
      value VARCHAR(25) NOT NULL
    )`,
    moneyAccountHistory: `
    ${TableTitle.moneyAccountHistory} (
      ${IdColumnConfig},
      typeId INTEGER NOT NULL,
      accountId INTEGER NOT NULL,
      instrumentId INTEGER NOT NULL,
      dateTimeUnix  INTEGER NOT NULL,
      value DOUBLE NOT NULL,
      FOREIGN KEY (typeId)
        REFERENCES ${TableTitle.moneyAccountHistoryItemTypes} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (accountId)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
  };

  const create =  () => {
    return Promise.all([
      createTable(tablesConfigs.users),
      createTable(tablesConfigs.accounts),
      createTable(tablesConfigs.investInstrumentTypes),
      createTable(tablesConfigs.currencies),
      createTable(tablesConfigs.investInstruments),
      createTable(tablesConfigs.instrumentComments),
      createTable(tablesConfigs.accountItems),
      createTable(tablesConfigs.instrumentAccountHistoryItemTypes),
      createTable(tablesConfigs.instrumentAccountHistory),
      createTable(tablesConfigs.moneyAccountHistoryItemTypes),
      createTable(tablesConfigs.moneyAccountHistory),
    ]);
  };

  await create();
};

export default createTables;

