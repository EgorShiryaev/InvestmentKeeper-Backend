import {
  SubscribeLastPriceRequest,
  SubscriptionAction,
} from 'tinkoff-invest-api/cjs/generated/marketdata';
import RemoteDatasourceParameters from '../remote_datasource_parameters';
import QuotationsDatasource from './quotations_datasource';

const QuotationsRemoteDatasource = ({
  api,
}: RemoteDatasourceParameters): QuotationsDatasource => {
  return {
    getAll: (instruments, handler) => {
      const request: SubscribeLastPriceRequest = {
        instruments: instruments,
        subscriptionAction: SubscriptionAction.SUBSCRIPTION_ACTION_SUBSCRIBE,
      };

      return api.stream.market.lastPrice(request, (lastPrice) => {
        //@ts-ignore
        handler(lastPrice);
      });
    },
  };
};

export default QuotationsRemoteDatasource;

