import ExceptionCode from './exception_code';
import ExceptionId from './exception_id';

export type IException = {
  id: ExceptionId;
  code: ExceptionCode;
  message: any;
};

const Exception = (data: IException) => {
  return data;
};

export default Exception;
