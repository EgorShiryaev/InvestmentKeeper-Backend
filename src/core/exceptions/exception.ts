import ExceptionType from './exception_type';

type Params = {
  type: ExceptionType;
  message: string;
};

const Exception = ({ type, message }: Params): Params => {
  return {
    type,
    message,
  };
};

export default Exception;
