import UserEntity from '../../domain/entities/user/user';

type UserModel = {
  id: number;
} & UserEntity;

export default UserModel;

