import jwt from 'jsonwebtoken';
import UserModel from '../../data/models/user';

const generateBearerToken = (
  user: UserModel,
  callback: (error: Error | null, token: string | undefined) => void
) => {
  jwt.sign({ user: user }, `${user.email}:${user.password}`, callback);
};

export default generateBearerToken;
