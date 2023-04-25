import UserModel from '../../data/models/user_model';

const storage = new Map<string, UserModel | undefined>();

const set = (token: string, user: UserModel) => {
  storage.set(token, user);
};

const get = (token: string) => {
  return storage.get(token);
};

const AuthentificatedUsersRepository = {
  get: get,
  set: set,
};

export default AuthentificatedUsersRepository;

