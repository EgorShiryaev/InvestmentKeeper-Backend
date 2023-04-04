import { SqlDatabase } from '../../data/databases/types';
import TableTitle from '../../data/databases/types/table_title';

const createTables = async (sqlDatabase: SqlDatabase) => {
  const usersTableTitle = TableTitle.users;
  const investmentAccountsTableTitle = TableTitle.investmentAccounts;
  const userInvestmentAccountsTableTitle = TableTitle.userInvestmentAccounts;

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
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      visibility BOOL NOT NULL
  )`;
    await sqlDatabase.run(script);
  };

  const createUsersInvestmentAccountsTableIfNotExists = async () => {
    const script = `CREATE TABLE IF NOT EXISTS ${userInvestmentAccountsTableTitle} (
        userId INT NOT NULL, 
        accountId INT NOT NULL,
        PRIMARY KEY(userId, accountId),
        FOREIGN KEY (userId)
          REFERENCES ${usersTableTitle} (id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (accountId)
          REFERENCES ${investmentAccountsTableTitle} (id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE
    ) WITHOUT ROWID`;
    await sqlDatabase.run(script);
  };

  const create = () => {
    return Promise.all([
      createUsersTableIfNotExists(),
      createInvestmentAccountsTableIfNotExists(),
      createUsersInvestmentAccountsTableIfNotExists(),
    ]);
  };

  await create();
};

export default createTables;
