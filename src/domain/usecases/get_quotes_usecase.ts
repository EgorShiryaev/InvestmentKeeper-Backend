import NotFoundException from '../../core/exception/not_found_exception';
import convertToCandleEntity from '../../core/utils/convectors/convert_to_candle_entity';
import convertToCandleTimesizeModel from '../../core/utils/convectors/convert_to_candle_timesize_model';
import CandlesDatasource from '../../data/datasources/candles_datasource/candles_datasource';
import InvestInstrumentsDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import CandleEntity from '../entities/candle_entity';
import CandleTimesizeEntity from '../entities/candle_timesize_entity';
import QuotesOperation from '../entities/quotes_operation_entity';
import InstrumentSubscribesRepository from '../repositories/instrument_subscribes_repository/instrument_subscribes_repository';
import UserQuotesSubscibesRepository from '../repositories/user_quotes_subscribes_repository';

type Params = {
  investInstrumentsDatasource: InvestInstrumentsDatasource;
  instrumentSubscribesRepository: InstrumentSubscribesRepository;
};

type CallMethodParams = {
  operation: QuotesOperation;
  instrumentId: number;
  userId: number;
};

export type GetQuotesUsecase = {
  call: (params: CallMethodParams) => Promise<void>;
};

const GetQuotesUsecaseImpl = ({
  investInstrumentsDatasource,
  instrumentSubscribesRepository,
}: Params): GetQuotesUsecase => {
  return {
    call: async ({ operation, instrumentId, userId }) => {
      const instrument = await investInstrumentsDatasource.getById(
        instrumentId,
      );
      if (!instrument) {
        throw NotFoundException('Invest instrument not found');
      }
      const figis = UserQuotesSubscibesRepository.getAll(userId);
      const figiIsIncludes = !!figis?.includes(instrument.figi);
      if (operation === QuotesOperation.subscribe && !figiIsIncludes) {
        console.log(operation, instrument.figi);
        UserQuotesSubscibesRepository.add(userId, instrument.figi);
        instrumentSubscribesRepository.increment(instrument.figi);
      } else if (operation === QuotesOperation.unsubscribe && figiIsIncludes) {
        console.log(operation, instrument.figi);
        UserQuotesSubscibesRepository.remove(userId, instrument.figi);
        instrumentSubscribesRepository.decrement(instrument.figi);
      }
    },
  };
};

export default GetQuotesUsecaseImpl;

