import UserModel from '../../../data/models/user_model';
import base64 from 'base-64';

const generateAuthToken = (user: UserModel): string => {
  return base64.encode(`${user.phoneNumber}.${user.password}`);
};

export default generateAuthToken;

