import UserDatasource from '../../data/datasources/user_datasource';
import NotFoundException from '../../core/exceptions/not_found_exception';
import UserRepository from '../../data/repositories/user_repository';
import UserEntity from '../entities/user';
import RecordAlreadyExistsException from '../../core/exceptions/record_already_exists_exception';
import InsertException from '../../core/exceptions/insert_exception';

type Params = {
    localDatasource: UserDatasource;
};

const UserRepositoryImpl = ({ localDatasource }: Params): UserRepository => {
  const getByEmail = async (email: string) => {
    const user = await localDatasource.getByEmail(email);
    if (user) {
      return user;
    }
    throw NotFoundException();
  };

  const add = async (user: UserEntity) => {
    const record = await localDatasource.getByEmail(user.email);

    if (record) {
      throw RecordAlreadyExistsException();
    }
    const result = await localDatasource.add(user);
    if (!result.lastId) {
      throw InsertException();
    }
  };

  return {
    getByEmail,
    add,
  };
};

export default UserRepositoryImpl;

