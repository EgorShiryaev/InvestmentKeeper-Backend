import UserEntity from '../../domain/entities/user';
import { RunResult } from '../databases/types';
import UserModel from '../models/user';

type UserDatasource = {
  getByEmail: (email: string) => Promise<UserModel | undefined>;
  add: (user: UserEntity) => Promise<RunResult>;
};

export default UserDatasource;
