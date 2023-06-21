import ExceptionId from '../../core/exception/exception_id';
import NotFoundException from '../../core/exception/not_found_exception';
import convertToCandleEntity from '../../core/utils/convectors/convert_to_candle_entity';
import convertToCandleTimesizeModel from '../../core/utils/convectors/convert_to_candle_timesize_model';
import InvestInstrumentsDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import CandleEntity from '../entities/candle_entity';
import CandleTimesizeEntity from '../entities/candle_timesize_entity';
import MoneyEntity from '../entities/money_entity';
import { InstrumentPriceRepository } from '../repositories/instrument_price_repository_impl';

type Params = {
  instrumentPriceRepository: InstrumentPriceRepository;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

export type GetInstrumentPriceUsecase = {
  call: (instrumentId: number) => Promise<MoneyEntity | undefined>;
};

const GetInstrumentPriceUsecaseImpl = ({
  instrumentPriceRepository,
  investInstrumentsDatasource,
}: Params): GetInstrumentPriceUsecase => {
  return {
    call: async (instrumentId) => {
      const instrument = await investInstrumentsDatasource.getById(
        instrumentId,
      );
      if (!instrument) {
        throw NotFoundException({
          id: ExceptionId.investInstrumentNotFound,
          message: 'Invest instrument not found',
        });
      }

      return instrumentPriceRepository.get(instrument.figi);
    },
  };
};

export default GetInstrumentPriceUsecaseImpl;

