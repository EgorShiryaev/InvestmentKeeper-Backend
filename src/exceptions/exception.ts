import ExceptionType from '../core/exceptions/exception_type';

type Params = {
  type: ExceptionType;
  message?: string;
};

const Exception = ({ type, message }: Params) => {
  return {
    type,
    message,
  };
};

export default Exception;
