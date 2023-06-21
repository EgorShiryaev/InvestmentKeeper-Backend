import Exception from './exception';
import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

type Params = {
  id: ExceptionId;
  message: string;
};

const BadRequestException = ({ message, id }: Params) => {
  return Exception({
    id: id,
    code: ExceptionCode.badRequest,
    message: message,
  });
};

export default BadRequestException;

