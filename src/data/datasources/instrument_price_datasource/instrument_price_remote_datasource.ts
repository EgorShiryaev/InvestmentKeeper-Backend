import { GetLastPricesRequest } from 'tinkoff-invest-api/cjs/generated/marketdata';
import RemoteDatasourceParameters from '../remote_datasource_parameters';
import InstrumentPriceDatasource from './instrument_price_datasource';
import { Helpers } from 'tinkoff-invest-api';

const InstrumentPriceRemoteDatasource = ({
  api,
}: RemoteDatasourceParameters): InstrumentPriceDatasource => {
  return {
    get: (figi) => {
      const data: GetLastPricesRequest = {
        figi: [figi],
      };
      return api.marketdata.getLastPrices(data).then((v) => {
        if (!v.lastPrices.length) {
          return;
        }
        return Helpers.toNumber(v.lastPrices[0].price);
      });
    },
  };
};

export default InstrumentPriceRemoteDatasource;

