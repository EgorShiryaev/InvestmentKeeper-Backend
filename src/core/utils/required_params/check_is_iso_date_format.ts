const isoRegEx = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

const checkIsIsoDateFormat = (value: string) => {
  if (!isoRegEx.test(value)) {
    return false;
  }
  const date = new Date(value);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.toISOString() === value
  );
};

export default checkIsIsoDateFormat;

