import Exception from './exception';
import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

const ServerErrorException = (message: any) => {
  return Exception({
    id: ExceptionId.serverError,
    code: ExceptionCode.serverError,
    message: message,
  });
};

export default ServerErrorException;

