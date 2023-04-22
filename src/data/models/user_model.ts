import BaseModel from './base_model';

type UserModel = BaseModel & {
  name: string;
  email: string;
  password: string;
};

export default UserModel;