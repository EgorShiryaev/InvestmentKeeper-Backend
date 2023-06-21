import ExceptionId from '../../core/exception/exception_id';
import NotFoundException from '../../core/exception/not_found_exception';
import ServerErrorException from '../../core/exception/server_error_exception';
import AccountsDatasource from '../../data/datasources/accounts_datasource/accounts_datasource';

type Params = {
  accountsDatasource: AccountsDatasource;
};

type CallMethodParams = {
  id: number;
  title: string;
};

export type UpdateAccountUsecase = {
  call: (params: CallMethodParams) => Promise<void>;
};

const UpdateAccountUsecaseImpl = ({
  accountsDatasource,
}: Params): UpdateAccountUsecase => {
  return {
    call: async ({ title, id }) => {
      const record = await accountsDatasource.getById(id);
      if (!record) {
        throw NotFoundException({
          id: ExceptionId.accountNotFound,
          message: 'Account not found',
        });
      }
      try {
        await accountsDatasource.update({
          id: id,
          title: title,
        });
      } catch {
        throw ServerErrorException('Failed account update');
      }
    },
  };
};

export default UpdateAccountUsecaseImpl;

