import AuthData from './auth_data';

type UserEntity = AuthData & {
  name: string;
};

export default UserEntity;

