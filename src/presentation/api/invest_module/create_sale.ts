import CreateException from '../../../core/exceptions/create_exception';
import UpdateException from '../../../core/exceptions/update_exception';
import getAuthToken from '../../../core/utils/auth_token/get_auth_token';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import AccountItemsDatasource from '../../../data/datasources/account_items_datasource/account_items_datasource';
import SalesDatasource from '../../../data/datasources/sales_datasource/sales_datasource';
import StatusCode from '../../../domain/entities/status_code';
import AuthentificatedUsersRepository from '../../../domain/repositories/authentificated_users_repository/authentificated_users_repository';
import CreateSaleRequestData from '../../types/request_data/create_sale_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../api';

type Params = {
  accountItemsDatasource: AccountItemsDatasource;
  salesDatasource: SalesDatasource;
  authentificatedUsersRepository: AuthentificatedUsersRepository;
};

const CreateSale = ({
  accountItemsDatasource,
  salesDatasource,
  authentificatedUsersRepository,
}: Params): ApiMethod => {
  const requiredParams = ['accountId', 'instrumentId', 'lots', 'price'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);

        const authToken = getAuthToken(request.headers);
        if (!authToken) {
          response.sendStatus(StatusCode.forbidden);
          return;
        }

        const params: CreateSaleRequestData = request.body;

        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          const responseData: ErrorResponseData = {
            error: checkResult.message,
          };
          response.status(StatusCode.badRequest).json(responseData);
          return;
        }

        const user = authentificatedUsersRepository.get(authToken);
        if (!user) {
          response.sendStatus(StatusCode.forbidden);
          return;
        }

        const accountItem =
          await accountItemsDatasource.getByAccountIdAndInstrumentId(
            params.accountId,
            params.instrumentId,
          );

        if (!accountItem) {
          const responseData: ErrorResponseData = {
            error:
              'You can`t sell this instrument because it is not in your account',
          };
          response.status(StatusCode.badRequest).json(responseData);
          return;
        }

        if (params.lots > accountItem.lots) {
          const responseData: ErrorResponseData = {
            error:
              'You can`t sell this instrument, because the number of lots on the account is less than you want to sell',
          };
          response.status(StatusCode.badRequest).json(responseData);
          return;
        }

        const newLots = accountItem.lots - params.lots;
        const changes = await accountItemsDatasource.update({
          id: accountItem.id,
          lots: newLots,
        });
        if (!changes && changes !== 0) {
          response.status(StatusCode.serverError).json(UpdateException());
          return;
        }

        const id = salesDatasource.create({
          accountItemId: accountItem.id,
          lots: params.lots,
          price: params.price,
        });

        if (!id && id !== 0) {
          response.status(StatusCode.serverError).json(CreateException());
          return;
        }

        response.sendStatus(StatusCode.noContent);
      } catch (error) {
        response.status(StatusCode.serverError).json(error);
      }
    },
  };
};

export default CreateSale;

