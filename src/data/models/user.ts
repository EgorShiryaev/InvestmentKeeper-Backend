import UserEntity from '../../domain/entities/user';

type UserModel = {
  id: number;
} & UserEntity;

export default UserModel;
