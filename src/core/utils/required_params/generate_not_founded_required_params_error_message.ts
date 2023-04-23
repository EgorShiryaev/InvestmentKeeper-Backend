const generateNotFoundedRequiredParamsErrorMessage = (
  params: string[],
): string => {
  const fields = params.join(', ');
  if (params.length === 1) {
    return `${fields} is required parameter`;
  }
  return `${fields} is required parameters`;
};

export default generateNotFoundedRequiredParamsErrorMessage;

