import QuotesOperation from '../../../domain/entities/quotes_operation_entity';

type GetQuotesRequestData = {
  operation: QuotesOperation;
  instrumentId: number;
};

export default GetQuotesRequestData;
