const phoneNumberRegEx =
  /^(\+7)\([0-9]{3}\)[0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/;

const checkPhoneNumberIsCorrectFormat = (value: string) => {
  return phoneNumberRegEx.test(value);
};

export default checkPhoneNumberIsCorrectFormat;

