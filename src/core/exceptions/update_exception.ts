import Exception from './exception';
import ExceptionType from './exception_type';

const UpdateException = () => {
  return Exception({
    type: ExceptionType.insertException,
    message: 'sql UPDATE command exception',
  });
};

export default UpdateException;

