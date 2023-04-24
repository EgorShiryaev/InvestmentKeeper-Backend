import Exception from './exception';
import ExceptionCode from './exception_code';

const FailedAuthException = () => {
  return Exception({
    code: ExceptionCode.failedAuth,
    message: 'Failed auth',
  });
};

export default FailedAuthException;

