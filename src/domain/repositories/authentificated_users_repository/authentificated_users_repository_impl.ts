import UserModel from '../../../data/models/user_model';
import AuthentificatedUsersRepository from './authentificated_users_repository';

const AuthentificatedUsersRepositoryImpl =
  (): AuthentificatedUsersRepository => {
    const storage = new Map<string, UserModel | undefined>();

    return {
      set: (token, user) => {
        storage.set(token, user);
      },
      get: (token) => {
        return storage.get(token);
      },
    };
  };

export default AuthentificatedUsersRepositoryImpl;
