import UserDatasource from '../../../data/datasources/user_datasource/user_datasource';
import NotFoundException from '../../../core/exceptions/not_found_exception';
import UserRepository from './user_repository';
import RecordAlreadyExistsException from '../../../core/exceptions/record_already_exists_exception';
import InsertException from '../../../core/exceptions/insert_exception';

type Params = {
  localDatasource: UserDatasource;
};

const UserRepositoryImpl = ({ localDatasource }: Params): UserRepository => {
  return {
    getByEmail: async (email) => {
      const user = await localDatasource.getByEmail(email);
      if (user) {
        return user;
      }
      throw NotFoundException();
    },
    create: async (user) => {
      const record = await localDatasource.getByEmail(user.email);
      if (record) {
        throw RecordAlreadyExistsException();
      }

      const result = await localDatasource.create(user);
      if (!result.lastId) {
        throw InsertException();
      }
      return result;
    },
  };
};

export default UserRepositoryImpl;

