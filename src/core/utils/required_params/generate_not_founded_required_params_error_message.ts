const generateNotFoundedRequiredParamsErrorMessage = (
  params: string[],
): string => {
  return params.map((v) => `${v} is required parameter`).join(', ');
};

export default generateNotFoundedRequiredParamsErrorMessage;

