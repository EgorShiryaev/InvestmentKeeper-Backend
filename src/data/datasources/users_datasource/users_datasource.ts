import UserModel from '../../models/user_model';

type CreateUserData = {
  name: string;
  phoneNumber: string;
  password: string;
};

interface UsersDatasource {
  getByPhoneNumber: (phoneNumber: string) => Promise<UserModel | undefined>;
  create: (data: CreateUserData) => Promise<number>;
  getById: (id: number) => Promise<UserModel | undefined>;
}

export default UsersDatasource;

