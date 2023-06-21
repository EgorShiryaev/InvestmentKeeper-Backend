import Exception from './exception';
import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

type Params = {
  id: ExceptionId;
  message: string;
};

const NotFoundException = ({ message, id }: Params) => {
  return Exception({
    id: id,
    code: ExceptionCode.notFound,
    message: message,
  });
};

export default NotFoundException;

