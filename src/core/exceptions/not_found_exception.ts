import Exception from './exception';
import ExceptionType from './exception_type';

const NotFoundException = () => {
  return Exception({
    type: ExceptionType.notFoundException,
    message: 'Not found',
  });
};

export default NotFoundException;
