import BadRequestException from '../../exception/bad_request_exception';
import generateNotFoundedRequiredParamsErrorMessage from './generate_not_founded_required_params_error_message';
import generateRequiredParamsErrorMessage from './generate_required_params_values_error_message';

type StringDictionary = {
  [key: string]: unknown;
};

type Params = {
  body: StringDictionary;
  params: string[];
  emptyStringIsCorrect?: true;
};

const removeValueOfArray = (value: string, array: string[]) => {
  return array.filter((v) => {
    return v !== value;
  });
};

const checkRequiredParams = ({
  body,
  params,
  emptyStringIsCorrect,
}: Params): void => {
  let requiredParams = [...params];
  for (const key in body) {
    requiredParams = removeValueOfArray(key, requiredParams);
  }

  if (requiredParams.length > 0) {
    const message =
      generateNotFoundedRequiredParamsErrorMessage(requiredParams);
    throw BadRequestException(message);
  }

  requiredParams = [...params];

  for (const key of requiredParams) {
    let value = body[key];

    if (typeof value === 'string') {
      value = value.trim();
    }

    if (value !== undefined && value !== null && value !== '') {
      requiredParams = removeValueOfArray(key, requiredParams);
    }
    if (emptyStringIsCorrect && typeof value === 'string') {
      requiredParams = removeValueOfArray(key, requiredParams);
    }
  }

  if (requiredParams.length > 0) {
    const message = generateRequiredParamsErrorMessage(requiredParams);

    throw BadRequestException(message);
  }
};

export default checkRequiredParams;

