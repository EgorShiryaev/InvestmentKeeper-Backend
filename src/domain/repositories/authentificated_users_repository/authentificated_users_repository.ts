import UserModel from '../../../data/models/user_model';

interface AuthentificatedUsersRepository {
  set: (token: string, user: UserModel) => void;
  get: (token: string) => UserModel | undefined;
}

export default AuthentificatedUsersRepository;
