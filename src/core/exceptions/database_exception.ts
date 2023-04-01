import Exception from './exception';
import ExceptionType from './exception_type';

type Params = {
  message: string;
};

const DatabaseException = ({ message }: Params) => {
  return Exception({
    type: ExceptionType.databaseException,
    message: message,
  });
};

export default DatabaseException;
