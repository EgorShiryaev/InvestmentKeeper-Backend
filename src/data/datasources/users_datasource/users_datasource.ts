import UserModel from '../../models/user_model';

type CreateUserData = {
  name: string;
  email: string;
  password: string;
};


interface UsersDatasource {
  getByEmail: (email: string) => Promise<UserModel | undefined>;
  create: (data: CreateUserData) => Promise<number>;
  getById: (id:number) => Promise<UserModel | undefined>;
}

export default UsersDatasource;

