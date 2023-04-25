const generateNotFoundedRequiredParamsErrorMessage = (
  params: string[],
): string => {
  return params.map((v) => `${v} parameter is required parameter`).join(', ');
};

export default generateNotFoundedRequiredParamsErrorMessage;

