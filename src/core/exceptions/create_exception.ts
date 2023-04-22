import Exception from './exception';
import ExceptionType from './exception_type';

const CreateException = () => {
  return Exception({
    type: ExceptionType.insertException,
    message: 'sql INSERT INTO command exception',
  });
};

export default CreateException;

