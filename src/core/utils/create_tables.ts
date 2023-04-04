import { SqlDatabase } from '../../data/databases/types';
import TableTitle from '../../data/databases/types/table_title';

const createTables = async (sqlDatabase: SqlDatabase) => {
  const usersTableTitle = TableTitle.users;
  const investmentAccountsTableTitle = TableTitle.investmentAccounts;

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

  const create = () => {
    return Promise.all([
      createUsersTableIfNotExists(),
      createInvestmentAccountsTableIfNotExists(),
    ]);
  };

  await create();
};

export default createTables;

