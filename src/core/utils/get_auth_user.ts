import { IncomingHttpHeaders } from 'http';
import getRequestUser from './request_utils/get_request_user';
import ForbiddenException from '../exception/forbidden_exception';
import UserModel from '../../data/models/user_model';

const getAuthedUser = (headers: IncomingHttpHeaders): UserModel  => {
  const user = getRequestUser(headers);
  if (!user) {
    throw ForbiddenException();
  }
  return user;
};

export default getAuthedUser;
