import { RawData, WebSocket } from 'ws';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import { IException } from '../../../core/exception/exception';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetQuotesRequestData from '../../types/request_data/get_quotes_request_data';
import QuotesOperation from '../../../domain/entities/quotes_operation_entity';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import NotFoundException from '../../../core/exception/not_found_exception';
import UserQuotesSubscibesRepository from '../../../domain/repositories/user_quotes_subscribes_repository';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import BadRequestException from '../../../core/exception/bad_request_exception';
import GetQuotesResponseData from '../../types/response_data/get_quotes_response_data';
import WebSocketMethod from '../../types/methods/websocket_method';
import InstrumentSubscribesRepository from '../../../domain/repositories/instrument_subscribes_repository/instrument_subscribes_repository';
import InstrumentPriceRepository from '../../../domain/repositories/instrument_price_repository';

type Params = {
  investInstrumentsDatasource: InvestInstrumentsDatasource;
  instrumentSubscribesRepository: InstrumentSubscribesRepository;
};

const GetQuotes = ({
  investInstrumentsDatasource,
  instrumentSubscribesRepository,
}: Params): WebSocketMethod => {
  const requiredParams = ['operation', 'instrumentId'];
  let responseInterval: NodeJS.Timer;

  const messageHandler = async (
    rawData: RawData,
    userId: number,
    ws: WebSocket,
  ) => {
    try {
      const params: GetQuotesRequestData = JSON.parse(rawData.toString());
      const checkResult = checkRequiredParams({
        body: params,
        params: requiredParams,
      });
      if (!checkResult.success) {
        throw BadRequestException(checkResult.message);
      }
      const instrument = await investInstrumentsDatasource.getById(
        params.instrumentId,
      );
      if (!instrument) {
        throw NotFoundException('Invest instrument not found');
      }
      const figis = UserQuotesSubscibesRepository.getAll(userId);
      const figiIsIncludes = !!figis?.includes(instrument.figi);
      if (params.operation === QuotesOperation.subscribe && !figiIsIncludes) {
        console.log(params.operation, instrument.figi);
        UserQuotesSubscibesRepository.add(userId, instrument.figi);
        instrumentSubscribesRepository.increment(instrument.figi);
      } else if (
        params.operation === QuotesOperation.unsubscribe &&
        figiIsIncludes
      ) {
        console.log(params.operation, instrument.figi);
        UserQuotesSubscibesRepository.remove(userId, instrument.figi);
        instrumentSubscribesRepository.decrement(instrument.figi);
      }
    } catch (error) {
      const exception = error as IException;
      const errorResponseData: ErrorResponseData = {
        message: exception.message,
      };
      const response = JSON.stringify(errorResponseData);
      ws.send(response);
    }
  };

  const initResponseInterval = (userId: number, ws: WebSocket) => {
    responseInterval = setInterval(() => {
      const figis = UserQuotesSubscibesRepository.getAll(userId);
      if (!figis) {
        return;
      }
      const quotations: Map<string, number> = new Map<string, number>();
      for (const figi of figis) {
        const price = InstrumentPriceRepository.get(figi);
        if (price) {
          quotations.set(figi, price);
        }
      }
      const responseData: GetQuotesResponseData = {
        quotations: Object.fromEntries(quotations),
      };
      const response = JSON.stringify(responseData);
      ws.send(response);
    }, 500);
  };

  const closeHandler = (userId: number) => {
    console.log('close userId:', userId);
    UserQuotesSubscibesRepository.removeAll(userId);
    clearInterval(responseInterval);
  };

  return {
    connectionHandler: (ws, request) => {
      try {
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        console.log('connect userId:', user.id);
        ws.on('message', (raw) => messageHandler(raw, user.id, ws));
        initResponseInterval(user.id, ws);
        ws.on('close', closeHandler);
      } catch (error) {
        const exception = error as IException;
        const errorResponseData: ErrorResponseData = {
          message: exception.message,
        };
        const response = JSON.stringify(errorResponseData);
        ws.send(response);
        ws.close();
      }
    },
  };
};

export default GetQuotes;

