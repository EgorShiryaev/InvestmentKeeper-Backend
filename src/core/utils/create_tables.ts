import { SqlDatabase } from '../../data/databases/types';
import TableTitle from '../../data/databases/types/table_title';

const createTables = async (sqlDatabase: SqlDatabase) => {
  const usersTableTitle = TableTitle.users;
  const investmentAccountsTableTitle = TableTitle.investmentAccounts;
  const investmentAccountItemsTableTitle = TableTitle.investmentAccountItems;
  const investmentInstrumentsTableTitle = TableTitle.investmentInstruments;

  const createUsersTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${usersTableTitle} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )`;
    await sqlDatabase.run(script);
  };

  const createInvestmentAccountsTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${investmentAccountsTableTitle} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INT NOT NULL, 
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        visibility BOOL NOT NULL,
        FOREIGN KEY (userId)
          REFERENCES ${usersTableTitle} (id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )`;
    await sqlDatabase.run(script);
  };

  const createInvestmentInstrumentsTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${investmentInstrumentsTableTitle} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT NOT NULL,
            title TEXT NOT NULL,
            numberInLot INT NOT NULL,
            aboutInstrument TEXT NOT NULL,
            type TEXT NOT NULL
        )`;
    await sqlDatabase.run(script);
  };

  const createInvestmentAccountItemsTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${investmentAccountItemsTableTitle} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        accountId INT NOT NULL, 
        instrumentId INT NOT NULL, 
        lotsNumber INT NOT NULL,
        lotAveragePrice DOUBLE NOT NULL,
        FOREIGN KEY (accountId)
          REFERENCES ${investmentAccountsTableTitle} (id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (instrumentId)
          REFERENCES ${investmentInstrumentsTableTitle} (id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )`;
    await sqlDatabase.run(script);
  };

  const create = async () => {
    await Promise.all([
      createUsersTableIfNotExists(),
      createInvestmentAccountsTableIfNotExists(),
      createInvestmentInstrumentsTableIfNotExists(),
    ]);
    return Promise.all([createInvestmentAccountItemsTableIfNotExists()]);
  };

  await create();
};

export default createTables;

