import generateNotFoundedRequiredParamsErrorMessage from './generate_not_founded_required_params_error_message';
import generaterequiredParamsErrorMessage from './generate_required_params_values_error_message';

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

const checkRequiredParams = (
  body: StringDictionary,
  params: string[],
): CheckResult => {
  let requiredParams = [...params];
  for (const key in body) {
    requiredParams = requiredParams.filter((value) => {
      return value !== key;
    });
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

    if (value && value !== 0) {
      requiredParams = requiredParams.filter((v) => {
        return v !== key;
      });
    }
  }

  if (requiredParams.length > 0) {
    const message = generaterequiredParamsErrorMessage(requiredParams);
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

