import UserModel from '../../../data/models/user';

const AuthTokenUserRepository = new Map<string, UserModel | undefined>();

const deleteTimeout = 60 * 60 * 1000;

export const addUserToAuthTokenUserRepository = (
  token: string,
  user: UserModel,
) => {
  AuthTokenUserRepository.set(token, user);
  setTimeout(
    () => AuthTokenUserRepository.set(token, undefined),
    deleteTimeout,
  );
};

export const getUserFromAuthTokenUserRepository = (
  token: string,
): UserModel | undefined => {
  return AuthTokenUserRepository.get(token);
};

