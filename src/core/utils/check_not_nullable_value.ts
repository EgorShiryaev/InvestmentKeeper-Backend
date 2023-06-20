const checkNotNullableValue = <T>(value: T | undefined | null) => {
  return value !== null && value !== undefined;
};

export default checkNotNullableValue;

