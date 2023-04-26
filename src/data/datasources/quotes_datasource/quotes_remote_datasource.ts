import {
  SubscribeLastPriceRequest,
  SubscriptionAction,
} from 'tinkoff-invest-api/cjs/generated/marketdata';
import RemoteDatasourceParameters from '../remote_datasource_parameters';
import QuotesDatasource from './quotes_datasource';
import { Helpers } from 'tinkoff-invest-api';

const QuotesRemoteDatasource = ({
  api,
}: RemoteDatasourceParameters): QuotesDatasource => {
  return {
    subscribeToPrice: (figi, onNewPrice) => {
      const instrument = {
        figi: figi,
      };
      const request: SubscribeLastPriceRequest = {
        instruments: [instrument],
        subscriptionAction: SubscriptionAction.SUBSCRIPTION_ACTION_SUBSCRIBE,
      };

      return api.stream.market.lastPrice(request, (lastPrice) => {
        const price = Helpers.toNumber(lastPrice.price);
        if (price) {
          onNewPrice(price);
        }
      });
    },
  };
};

export default QuotesRemoteDatasource;

