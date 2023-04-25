import generateNotFoundedRequiredParamsErrorMessage from './generate_not_founded_required_params_error_message';
import generateRequiredParamsErrorMessage from './generate_required_params_values_error_message';

type CheckResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

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
}: Params): CheckResult => {
  let requiredParams = [...params];
  for (const key in body) {
    requiredParams = removeValueOfArray(key, requiredParams);
  }

  if (requiredParams.length > 0) {
    const message =
      generateNotFoundedRequiredParamsErrorMessage(requiredParams);
    return {
      success: false,
      message: message,
    };
  }

  requiredParams = [...params];

  for (const key of requiredParams) {
    let value = body[key];

    if (typeof value === 'string') {
      value = value.trim();
    }

    console.log(value);
    if (value && value !== 0) {
      requiredParams = removeValueOfArray(key, requiredParams);
    }
    if (emptyStringIsCorrect && typeof value === 'string') {
      requiredParams = removeValueOfArray(key, requiredParams);
      
    } 
  }

  if (requiredParams.length > 0) {
    const message = generateRequiredParamsErrorMessage(requiredParams);
    return {
      success: false,
      message: message,
    };
  }

  return {
    success: true,
  };
};

export default checkRequiredParams;

