import UserEntity from '../../domain/entities/user';
import UserModel from '../models/user';

type UserRepository = {
  getByEmail: (email: string) => Promise<UserModel>;
  add: (newUser: UserEntity) => Promise<void>;
};

export default UserRepository;
