import Exception from './exception';
import ExceptionType from './exception_type';

const FailureAuthException = () => {
  return Exception({
    type: ExceptionType.failureAuthException,
    message: 'Authentication is failed',
  });
};

export default FailureAuthException;

