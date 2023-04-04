
import RegistrationData from '../../../domain/entities/api/auth_module/registration_data';
import { RunResult } from '../../databases/types';
import UserModel from '../../models/user';

type UserDatasource = {
  getByEmail: (email: string) => Promise<UserModel | undefined>;
  create: (user: RegistrationData) => Promise<RunResult>;
};

export default UserDatasource;

