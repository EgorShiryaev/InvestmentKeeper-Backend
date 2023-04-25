import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InstrumentCommentsDatasource from '../../../data/datasources/instrument_comments_datasource/instrument_comments_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import StatusCode from '../../../domain/entities/status_code';
import GetCommentRequestData from '../../types/request_data/get_comment_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import GetCommentResponseData from '../../types/response_data/get_comment_response_data';
import ApiMethod from '../api';

type Params = {
  instrumentCommentsDatasource: InstrumentCommentsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

const GetComment = ({
  instrumentCommentsDatasource,
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['instrumentId'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params = request.query as unknown as GetCommentRequestData;
        const checkResult = checkRequiredParams(params, requiredParams);
        if (!checkResult.success) {
          throw BadRequestException(checkResult.message);
        }
        const user = getRequestUser(request.headers);
        if (!user) {
          throw ForbiddenException();
        }
        const instrument = await investInstrumentsDatasource.getById(
          params.instrumentId,
        );
        if (!instrument) {
          throw NotFoundException('Invest instrument not found');
        }
        const commentModel =
          await instrumentCommentsDatasource.getByUserIdAndInstrumentId(
            user.id,
            instrument.id,
          );
        const comment = commentModel?.comment ?? '';
        const responseData: GetCommentResponseData = {
          comment: comment,
        };
        response.status(StatusCode.success).json(responseData);
      } catch (error) {
        const exception = error as IException;
        const statusCode = getStatusCodeByExceptionCode(exception.code);
        const errorResponseData: ErrorResponseData = {
          message: exception.message,
        };
        response.status(statusCode).json(errorResponseData);
      }
    },
  };
};

export default GetComment;
