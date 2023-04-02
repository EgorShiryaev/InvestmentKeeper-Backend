import ExceptionType from './exception_type';

type Params = {
  type: ExceptionType;
  message: string;
};

export interface IException {
  type: ExceptionType;
  message: string;
}

const Exception = ({ type, message }: Params): IException => {
  return {
    type,
    message,
  };
};

export default Exception;

