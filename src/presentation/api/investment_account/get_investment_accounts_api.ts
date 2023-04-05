import { getUserFromAuthTokenUserRepository } from '../../../core/utils/auth_token/auth_token_user_repository';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import InvestmentAccountItemModel from '../../../data/models/investment_account_item';
import StatusCode from '../../../domain/entities/api/status_code';
import InvestmentAccountEntity from '../../../domain/entities/investment_account/investment_account';
import InvestmentAccountItemsRepository from '../../../domain/repositories/investment_account_items_repository/investment_account_items_repository';
import UserInvestmentAccountsRepository from '../../../domain/repositories/investment_accounts_repository/user_investment_accounts_repository';
import InvestmentInstrumentsRepository from '../../../domain/repositories/investment_instruments_repository/investment_instruments_repository';
import Api from '../api';

type Params = {
  investmentAccountsRepository: UserInvestmentAccountsRepository;
  investmentAccountItemsRepository: InvestmentAccountItemsRepository;
  investmentInstrumentsRepository: InvestmentInstrumentsRepository;
};

const GetInvestmentAccountsApi = ({
  investmentAccountsRepository,
  investmentAccountItemsRepository,
  investmentInstrumentsRepository,
}: Params): Api => {
  const getInstrument = async (
    investmentAccountItem: InvestmentAccountItemModel,
  ) => {
    const instrument = await investmentInstrumentsRepository.getWhereId(
      investmentAccountItem.instrumentId,
    );

    return {
      ...investmentAccountItem,
      instrumentId: undefined,
      instrument: instrument,
    };
  };
  const getInvestmentAccountItemWithInstrument = async (
    account: InvestmentAccountEntity,
  ) => {
    const items = await investmentAccountItemsRepository.getAll(account.id);
    const itemsWithInstrument = await Promise.all(items.map(getInstrument));
    return { ...account, items: itemsWithInstrument };
  };

  return {
    handler: async (request, response) => {
      console.log(request.method, request.url);

      const authToken = getAuthToken(request.headers);
      if (!authToken) {
        response.sendStatus(StatusCode.forbidden);
        return;
      }

      const user = getUserFromAuthTokenUserRepository(authToken);
      if (!user) {
        response.sendStatus(StatusCode.forbidden);
        return;
      }

      try {
        const accounts = await investmentAccountsRepository.getAll(user.id);
        const accountsWithItems = await Promise.all(
          accounts.map(getInvestmentAccountItemWithInstrument),
        );

        response
          .status(StatusCode.success)
          .json({ accounts: accountsWithItems });
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default GetInvestmentAccountsApi;

