import { SqlDatabase } from '../../data/databases/types';
import AuthentificatedUsersRepository from '../../domain/repositories/authentificated_users_repository';

type ModuleDIParams = {
  sqlDatabase: SqlDatabase;
};

export default ModuleDIParams;

