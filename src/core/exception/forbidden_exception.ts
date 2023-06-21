import Exception from './exception';
import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

const ForbiddenException = () => {
  return Exception({
    id: ExceptionId.forbidden,
    code: ExceptionCode.forbidden,
    message: 'Forbidden',
  });
};

export default ForbiddenException;

