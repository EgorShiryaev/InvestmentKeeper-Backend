import Exception from './exception';
import ExceptionType from './exception_type';

const RecordAlreadyExistsException = () => {
  return Exception({
    type: ExceptionType.recordAlreadyExists,
    message: 'Record is already exists',
  });
};

export default RecordAlreadyExistsException;
