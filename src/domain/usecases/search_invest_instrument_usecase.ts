import convertToInvestInstrumentEntity from '../../core/utils/convectors/convert_to_invest_instrument_entity';
import InvestInstrumentsDatasource from '../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import InvestInstrumentEntity from '../entities/invest_instrument_entity';

type Params = {
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

type CallMethodParams = {
  query: string;
};

export type SearchInvestInstrumentUsecase = {
  call: (params: CallMethodParams) => Promise<InvestInstrumentEntity[]>;
};

const SearchInvestInstrumentUsecaseImpl = ({
  investInstrumentsDatasource,
}: Params): SearchInvestInstrumentUsecase => {
  return {
    call: async ({ query }) => {
      const trimmedQuery = query.trim();
      const instrumentsFullData =
        await investInstrumentsDatasource.getAllLikeTitleOrTickerOrFigi(
          trimmedQuery,
        );
      return instrumentsFullData.map((instrument) =>
        convertToInvestInstrumentEntity(instrument),
      );
    },
  };
};

export default SearchInvestInstrumentUsecaseImpl;


