const generateRequiredParamsError = (
  body: object,
  params: string[],
): string => {
  const requiredParams = [...params];
  for (const key in body) {
    requiredParams.filter((value) => value === key);
  }
  const fields = requiredParams.join(', ');
  return `${fields} is required parameters`;
};

export default generateRequiredParamsError;

