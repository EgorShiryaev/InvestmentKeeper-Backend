import Exception from './exception';
import ExceptionCode from './exception_code';

const ForbiddenException = () => {
  return Exception({
    code: ExceptionCode.forbidden,
    message: 'Forbidden',
  });
};

export default ForbiddenException;

