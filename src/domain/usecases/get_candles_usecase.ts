import ExceptionId from '../../core/exception/exception_id';
import NotFoundException from '../../core/exception/not_found_exception';
import convertToCandleEntity from '../../core/utils/convectors/convert_to_candle_entity';
import convertToCandleTimesizeModel from '../../core/utils/convectors/convert_to_candle_timesize_model';
import CandlesDatasource from '../../data/datasources/candles_datasource/candles_datasource';
import InvestInstrumentsDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import CandleEntity from '../entities/candle_entity';
import CandleTimesizeEntity from '../entities/candle_timesize_entity';

type Params = {
  investInstrumentsDatasource: InvestInstrumentsDatasource;
  candlesDatasource: CandlesDatasource;
};

type CallMethodParams = {
  instrumentId: number;
  candleTimesize: CandleTimesizeEntity;
  from: string;
  to: string;
};

export type GetCandlesUsecase = {
  call: (params: CallMethodParams) => Promise<CandleEntity[]>;
};

const GetCandlesUsecaseImpl = ({
  investInstrumentsDatasource,
  candlesDatasource,
}: Params): GetCandlesUsecase => {
  return {
    call: async ({ instrumentId, candleTimesize, from, to }) => {
      const instrument = await investInstrumentsDatasource.getById(
        instrumentId,
      );
      if (!instrument) {
        throw NotFoundException({
          id: ExceptionId.investInstrumentNotFound,
          message: 'Invest instrument not found',
        });
      }
      const params = {
        from: new Date(from),
        to: new Date(to),
        figi: instrument.figi,
        candleTimesize: convertToCandleTimesizeModel(candleTimesize),
      };
      const candles = await candlesDatasource.get(params);
      return candles.map((v) => convertToCandleEntity(v));
    },
  };
};

export default GetCandlesUsecaseImpl;

