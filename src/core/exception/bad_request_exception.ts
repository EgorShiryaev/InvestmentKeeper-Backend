import Exception from './exception';
import ExceptionCode from './exception_code';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BadRequestException = (message: any) => {
  return Exception({
    code: ExceptionCode.badRequest,
    message: message,
  });
};

export default BadRequestException;

