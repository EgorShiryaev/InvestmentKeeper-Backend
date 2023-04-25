const checkStringIsValidDate = (value: string) => {
  const date = new Date(value);

  return !isNaN(date.getTime());
};

export default checkStringIsValidDate;
