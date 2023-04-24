import Exception from './exception';
import ExceptionCode from './exception_code';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DatabaseException = (message: any) => {
  return Exception({
    code: ExceptionCode.database,
    message: message,
  });
};

export default DatabaseException;

