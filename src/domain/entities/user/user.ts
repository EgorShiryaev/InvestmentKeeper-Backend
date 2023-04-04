import AuthData from '../api_data/auth_data';

type UserEntity = AuthData & {
  name: string;
};

export default UserEntity;

