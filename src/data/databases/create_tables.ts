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
      phoneNumber VARCHAR(18) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `,
    accounts: `
    ${TableTitle.accounts} (
      ${IdColumnConfig},
      userId INTEGER NOT NULL,
      title VARCHAR(25) NOT NULL, 
      visibility BOOL NOT NULL DEFAULT 1,
      currencyBalance DOUBLE NOT NULL DEFAULT 0,
      totalCommission DOUBLE NOT NULL DEFAULT 0,
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
      lots INTEGER NOT NULL DEFAULT 0,
      averagePurchasePrice DOUBLE NOT NULL DEFAULT 0,
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
    sales: `
    ${TableTitle.sales} (
      ${IdColumnConfig},
      accountItemId INTEGER NOT NULL,
      date TEXT NOT NULL,
      lots INTEGER NOT NULL,
      price DOUBLE NOT NULL,
      commission DOUBLE NOT NULL DEFAULT 0,
      FOREIGN KEY (accountItemId)
        REFERENCES ${TableTitle.accountItems} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    purchases: `
    ${TableTitle.purchases} (
      ${IdColumnConfig},
      accountItemId INTEGER NOT NULL,
      date TEXT NOT NULL,
      lots INTEGER NOT NULL,
      price DOUBLE NOT NULL,
      commission DOUBLE NOT NULL DEFAULT 0,
      FOREIGN KEY (accountItemId)
        REFERENCES ${TableTitle.accountItems} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    refills: `
    ${TableTitle.refills} (
      ${IdColumnConfig},
      accountId INTEGER NOT NULL,
      date TEXT NOT NULL,
      value DOUBLE NOT NULL,
      FOREIGN KEY (accountId)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
    withdrawals: `
    ${TableTitle.withdrawals} (
      ${IdColumnConfig},
      accountId INTEGER NOT NULL,
      date TEXT NOT NULL,
      value DOUBLE NOT NULL,
      FOREIGN KEY (accountId)
        REFERENCES ${TableTitle.accounts} (id) 
          ON UPDATE CASCADE
          ON DELETE CASCADE
    )`,
  };

  const create = () => {
    return Promise.all([
      createTable(tablesConfigs.users),
      createTable(tablesConfigs.accounts),
      createTable(tablesConfigs.investInstrumentTypes),
      createTable(tablesConfigs.currencies),
      createTable(tablesConfigs.investInstruments),
      createTable(tablesConfigs.instrumentComments),
      createTable(tablesConfigs.accountItems),
      createTable(tablesConfigs.sales),
      createTable(tablesConfigs.purchases),
      createTable(tablesConfigs.refills),
      createTable(tablesConfigs.withdrawals),
    ]);
  };

  await create();
};

export default createTables;

