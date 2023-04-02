import UserEntity from '../../entities/user/user';
import UserModel from '../../../data/models/user';

type UserRepository = {
  getByEmail: (email: string) => Promise<UserModel>;
  add: (newUser: UserEntity) => Promise<void>;
};

export default UserRepository;

