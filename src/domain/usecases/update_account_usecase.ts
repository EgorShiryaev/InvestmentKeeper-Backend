import NotFoundException from '../../core/exception/not_found_exception';
import ServerErrorException from '../../core/exception/server_error_exception';
import checkChangesIsCorrect from '../../core/utils/required_params/check_changes_is_correct';
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
        throw NotFoundException('Account not found');
      }
      const changes = await accountsDatasource.update({
        id: id,
        title: title,
      });
      if (!checkChangesIsCorrect(changes)) {
        throw ServerErrorException('Failed account update');
      }
    },
  };
};

export default UpdateAccountUsecaseImpl;

