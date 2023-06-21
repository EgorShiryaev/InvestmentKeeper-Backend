import { GetLastPricesRequest } from 'tinkoff-invest-api/cjs/generated/marketdata';
import RemoteDatasourceParameters from '../remote_datasource_parameters';
import InstrumentPriceDatasource from './instrument_price_datasource';

const InstrumentPriceRemoteDatasource = ({
  api,
}: RemoteDatasourceParameters): InstrumentPriceDatasource => {
  return {
    getAll: (figis: string[]) => {
      const data: GetLastPricesRequest = {
        figi: figis,
      };
      return api.marketdata.getLastPrices(data).then((v) => v.lastPrices);
    },
  };
};

export default InstrumentPriceRemoteDatasource;

