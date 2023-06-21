import Exception from './exception';
import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

const DatabaseException = (message: any) => {
  return Exception({
    id: ExceptionId.database,
    code: ExceptionCode.database,
    message: message,
  });
};

export default DatabaseException;

