import { IncomingHttpHeaders } from 'http';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository';
import getAuthToken from '../auth_token/get_auth_token';
import UserModel from '../../../data/models/user_model';

const getRequestUser = (
  headers: IncomingHttpHeaders,
): UserModel | undefined => {
  const authToken = getAuthToken(headers);
  if (authToken) {
    return AuthentificatedUsersRepository.get(authToken);
  }
};

export default getRequestUser;

