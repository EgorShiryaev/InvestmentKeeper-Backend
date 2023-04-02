import UserModel from '../../../data/models/user';
import base64 from 'base-64';

const generateAuthToken = (user: UserModel): string => {
  return base64.encode(`${user.email}.${user.password}`);
};

export default generateAuthToken;

