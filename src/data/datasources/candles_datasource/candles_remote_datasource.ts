import CandlesDatasource from './candles_datasource';
import RemoteDatasourceParameters from '../remote_datasource_parameters';

const CandlesRemoteDatasource = ({
  api,
}: RemoteDatasourceParameters): CandlesDatasource => {
  return {
    get: ({ from, to, figi, candleTimesize }) => {
      return api.marketdata
        .getCandles({
          figi: figi,
          from: from,
          to: to,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          interval: candleTimesize,
        })
        .then((v) => v.candles);
    },
  };
};

export default CandlesRemoteDatasource;

