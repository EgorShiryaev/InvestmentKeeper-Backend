import Exception from './exception';
import ExceptionCode from './exception_code';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NotFoundException = (message: any) => {
  return Exception({
    code: ExceptionCode.notFound,
    message: message,
  });
};

export default NotFoundException;

