import CandlesDatasource from './candles_datasource';
import RemoteDatasourceParameters from '../remote_datasource_parameters';

const CandlesRemoteDatasource = ({
  api,
}: RemoteDatasourceParameters): CandlesDatasource => {
  return {
    get: ({ from, to, figi, candleTimesize }) => {
      return api
        .candlesGet({
          from: from,
          to: to,
          figi: figi,
          interval: candleTimesize,
        })
        .then((v) => {
          return v.candles;
        });
    },
  };
};

export default CandlesRemoteDatasource;

