import BadRequestException from '../../../core/exception/bad_request_exception';
import { IException } from '../../../core/exception/exception';
import ForbiddenException from '../../../core/exception/forbidden_exception';
import NotFoundException from '../../../core/exception/not_found_exception';
import ServerErrorException from '../../../core/exception/server_error_exception';
import checkChangesIsCorrect from '../../../core/utils/check_changes_is_correct';
import checkIdIsCorrect from '../../../core/utils/check_id_is_correct';
import getRequestUser from '../../../core/utils/request_utils/get_request_user';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import InstrumentCommentsDatasource from '../../../data/datasources/instrument_comments_datasource/instrument_comments_datasource';
import InvestInstrumentsDatasource from '../../../data/datasources/invest_instruments_datasource/invest_instruments_datasource';
import StatusCode from '../../../domain/entities/status_code';
import UpdateCommentRequestData from '../../types/request_data/update_comment_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../api';

type Params = {
  instrumentCommentsDatasource: InstrumentCommentsDatasource;
  investInstrumentsDatasource: InvestInstrumentsDatasource;
};

const UpdateInstrumentComment = ({
  instrumentCommentsDatasource,
  investInstrumentsDatasource,
}: Params): ApiMethod => {
  const requiredParams = ['instrumentId', 'comment'];

  const createInstrumentComment = async (
    userId: number,
    instrumentId: number,
    comment: string,
  ) => {
    const id = await instrumentCommentsDatasource.create({
      userId: userId,
      instrumentId: instrumentId,
      comment: comment,
    });
    if (!checkIdIsCorrect(id)) {
      throw ServerErrorException('Failed user creation');
    }
  };

  const deleteInstrumentComment = async (commentId?: number) => {
    if (commentId) {
      const changes = await instrumentCommentsDatasource.delete(commentId);
      if (!checkChangesIsCorrect(changes)) {
        throw ServerErrorException('Failed instrument comment delete');
      }
    }
  };

  const updateInstrumentComment = async (id: number, comment: string) => {
    const changes = await instrumentCommentsDatasource.update({
      id: id,
      comment: comment,
    });
    if (!checkChangesIsCorrect(changes)) {
      throw ServerErrorException('Failed instrument comment update');
    }
  };

  const createOrUpdateInstrumentComment = async (
    comment: string,
    userId: number,
    instrumentId: number,
    commentId?: number,
  ) => {
    if (commentId) {
      await updateInstrumentComment(commentId, comment);
    } else {
      await createInstrumentComment(userId, instrumentId, comment);
    }
  };

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);

        const params: UpdateCommentRequestData = request.body;
        const checkResult = checkRequiredParams({
          body: params,
          params: requiredParams,
          emptyStringIsCorrect: true,
        });
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

        if (params.comment.length === 0) {
          deleteInstrumentComment(commentModel?.id);
        } else if (params.comment.trim().length === 0) {
          throw BadRequestException(
            'comment trimmed string should be not empty string',
          );
        } else if (params.comment.length > 0) {
          createOrUpdateInstrumentComment(
            params.comment,
            user.id,
            instrument.id,
            commentModel?.id,
          );
        }

        response.sendStatus(StatusCode.noContent);
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

export default UpdateInstrumentComment;

