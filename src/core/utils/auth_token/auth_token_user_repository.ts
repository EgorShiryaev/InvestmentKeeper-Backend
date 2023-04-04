import UserModel from '../../../data/models/user';

const AuthTokenUserRepository = new Map<string, UserModel>();

export const addUserToAuthTokenUserRepository = (
  token: string,
  user: UserModel,
) => {
  AuthTokenUserRepository.set(token, user);
};

export const getUserFromAuthTokenUserRepository = (
  token: string,
): UserModel | undefined => {
  return AuthTokenUserRepository.get(token);
};

