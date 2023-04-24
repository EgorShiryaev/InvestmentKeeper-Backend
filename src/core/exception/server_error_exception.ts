import Exception from './exception';
import ExceptionCode from './exception_code';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ServerErrorException = (message: any) => {
  return Exception({
    code: ExceptionCode.serverError,
    message: message,
  });
};

export default ServerErrorException;

