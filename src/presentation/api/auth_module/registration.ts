import { IException } from '../../../core/exception/exception';
import checkRequiredParams from '../../../core/utils/required_params/check_required_params';
import getStatusCodeByExceptionCode from '../../../core/utils/response_utils/get_status_code_by_exception_code';
import StatusCode from '../../../domain/entities/status_code';
import RegistrationRequestData from '../../types/request_data/registration_request_data';
import ErrorResponseData from '../../types/response_data/error_response_data';
import ApiMethod from '../../types/methods/api_method';
import { RegistrationUsecase } from '../../../domain/usecases/registration_usecase';

type Params = {
  registrationUsecase: RegistrationUsecase;
};

const Registration = ({ registrationUsecase }: Params): ApiMethod => {
  const requiredParams = ['name', 'password', 'phoneNumber'];

  return {
    handler: async (request, response) => {
      try {
        console.log(request.method, request.url);
        const params: RegistrationRequestData = request.body;
        checkRequiredParams({
          body: params,
          params: requiredParams,
        });
        const responseData = await registrationUsecase.call({
          name: params.name,
          password: params.password,
          phoneNumber: params.phoneNumber,
        });
        response.status(StatusCode.success).json(responseData);
      } catch (error) {
        const exception = error as IException;
        const statusCode = getStatusCodeByExceptionCode(exception.code);
        const errorResponseData: ErrorResponseData = {
          id: exception.id,
          message: exception.message,
        };
        response.status(statusCode).json(errorResponseData);
      }
    },
  };
};

export default Registration;

