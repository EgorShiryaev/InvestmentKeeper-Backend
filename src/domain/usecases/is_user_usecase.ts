import UsersDatasource from '../../data/datasources/users_datasource/users_datasource';

type Params = {
  usersDatasource: UsersDatasource;
};

export type IsUserUsecase = {
  call: (phoneNumber: string) => Promise<boolean>;
};

const IsUserUsecaseImpl = ({ usersDatasource }: Params): IsUserUsecase => {
  return {
    call: async (phoneNumber) => {
      const user = await usersDatasource.getByPhoneNumber(phoneNumber);
      return !!user;
    },
  };
};

export default IsUserUsecaseImpl;

