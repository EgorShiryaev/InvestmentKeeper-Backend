import BaseModel from './base_model';

type UserModel = BaseModel & {
  name: string;
  phone_number: string;
  password: string;
};

export default UserModel;

