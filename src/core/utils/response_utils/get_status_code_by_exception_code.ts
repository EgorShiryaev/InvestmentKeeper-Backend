import StatusCode from '../../../domain/entities/status_code';
import ExceptionCode from '../../exception/exception_code';

const getStatusCodeByExceptionCode = (code: ExceptionCode) => {
  switch (code) {
  case ExceptionCode.database:
    return StatusCode.serverError;
  case ExceptionCode.badRequest:
    return StatusCode.badRequest;
  case ExceptionCode.notFound:
    return StatusCode.notFound;
  case ExceptionCode.forbidden:
    return StatusCode.forbidden;
  case ExceptionCode.serverError:
    return StatusCode.serverError;
  case ExceptionCode.failedAuth:
    return StatusCode.failedAuth;
  }
  return StatusCode.serverError;
};

export default getStatusCodeByExceptionCode;

