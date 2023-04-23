const generateRequiredParamsValuesErrorMessage = (
  params: string[],
): string => {
  const fields = params.join(', ');
  return `${fields} should be not null, not undefined and not empty string`;
};
  
export default generateRequiredParamsValuesErrorMessage;
  
  