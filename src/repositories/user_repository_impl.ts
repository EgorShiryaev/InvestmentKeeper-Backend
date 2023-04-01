import UserDatasource from "../types/datasources/user_datasource";
import DatabaseException from "../exceptions/database_exception";
import NotFoundException from "../exceptions/not_found_exception";
import UserRepository from "../types/repositories/user_repository";

type Params = {
  localDatasource: UserDatasource;
};

const UserRepositoryImpl = ({ localDatasource }: Params): UserRepository => {
  const getByEmail = async (email: string) => {
    try {
      const user = await localDatasource.getByEmail(email);
      if (user) {
        return user;
      }
      throw NotFoundException();
    } catch (error) {
      throw DatabaseException({ message: `${error}` });
    }
  };

  return {
    getByEmail,
  };
};

export default UserRepositoryImpl;
