import Exception from './exception';
import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

const FailedAuthException = () => {
  return Exception({
    id: ExceptionId.failedAuth,
    code: ExceptionCode.failedAuth,
    message: 'Failed auth',
  });
};

export default FailedAuthException;

