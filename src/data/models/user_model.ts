import BaseModel from './base_model';

type UserModel = BaseModel & {
  name: string;
  phoneNumber: string;
  password: string;
};

export default UserModel;
