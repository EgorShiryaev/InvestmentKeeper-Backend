import ErrorResponseData from '../../../presentation/types/response_data/error_response_data';
import { IException } from '../../exception/exception';
import ExceptionId from '../../exception/exception_id';
import getStatusCodeByExceptionCode from './get_status_code_by_exception_code';

const getCodeAndResponseDataByException = (exception: IException) => {
  const statusCode = getStatusCodeByExceptionCode(exception.code);

  const responseData: ErrorResponseData = {
    id: exception?.id ?? ExceptionId.unknown,
    message: exception.message,
  };
  return { statusCode, responseData };
};

export default getCodeAndResponseDataByException;

