import Exception from "./exception";
import ExceptionType from "./exception_type";

const NotFoundException = () => {
  return Exception({ type: ExceptionType.notFoundException });
};

export default NotFoundException;
