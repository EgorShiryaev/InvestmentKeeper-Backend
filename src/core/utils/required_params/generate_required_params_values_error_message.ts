const generateRequiredParamsValuesErrorMessage = (params: string[]): string => {
  return params
    .map(
      (v) =>
        `${v} parameter should be not null, not undefined and not empty string`,
    )
    .join(', ');
};

export default generateRequiredParamsValuesErrorMessage;

