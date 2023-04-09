import { SqlDatabase } from '../../data/databases/types';
import TableTitle from '../../data/databases/types/table_title';

const createTables = async (sqlDatabase: SqlDatabase) => {
  const usersTableTitle = TableTitle.users;
  const investmentAccountsTableTitle = TableTitle.investmentAccounts;
  const investmentAccountItemsTableTitle = TableTitle.investmentAccountItems;
  const investmentInstrumentsTableTitle = TableTitle.investmentInstruments;

  const createUsersTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${usersTableTitle} (
            id INT PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password TEXT NOT NULL
        )`;
    await sqlDatabase.run(script);
  };

  const createInvestmentAccountsTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${investmentAccountsTableTitle} (
        id INT PRIMARY KEY AUTOINCREMENT,
        userId INT NOT NULL, 
        title VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
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
            id INT PRIMARY KEY AUTOINCREMENT,
            ticker VARCHAR(255) NOT NULL,
            title VARCHAR(255 NOT NULL,
            numberInLot INT NOT NULL,
            aboutInstrument TEXT NOT NULL,
            type TEXT NOT NULL,
            currency 
        )`;
    await sqlDatabase.run(script);
  };

  const createInvestmentAccountItemsTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${investmentAccountItemsTableTitle} (
        id INT PRIMARY KEY AUTOINCREMENT,
        accountId INT NOT NULL, 
        instrumentId INT NOT NULL, 
        lotsNumber INT NOT NULL,
        lotAveragePrice DOUBLE NOT NULL,
        averageCurrencyPrice DOUBLE,
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

