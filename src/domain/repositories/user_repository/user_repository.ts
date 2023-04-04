import { RunResult } from '../../../data/databases/types';
import UserModel from '../../../data/models/user';
import RegistrationData from '../../entities/api/auth_module/registration_data';

type UserRepository = {
  getByEmail: (email: string) => Promise<UserModel>;
  create: (newUser: RegistrationData) => Promise<RunResult>;
};

export default UserRepository;

