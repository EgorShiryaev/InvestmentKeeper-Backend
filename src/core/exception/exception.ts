import ExceptionCode from './exception_code';

export type IException = {
  code: ExceptionCode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
};

const Exception = (data: IException) => {
  return data;
};

export default Exception;
