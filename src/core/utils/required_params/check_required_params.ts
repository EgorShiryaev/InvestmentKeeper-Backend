const checkRequiredParams = (body: object, params: string[]): boolean => {
  let requiredParams = [...params];
  for (const key in body) {
    requiredParams = requiredParams.filter((value) => {
      return value !== key;
    });
    if (requiredParams.length === 0) {
      return true;
    }
  }
  
  return false;
};

export default checkRequiredParams;

