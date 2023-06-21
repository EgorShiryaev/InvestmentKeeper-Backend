enum ExceptionId {
  invalidPhoneFormat = 'invalidPhoneFormat',
  invalidDateDormat = 'invalidDateDormat',
  invalidCandleTimesize = 'invalidCandleTimesize',

  notFoundRequiredParams = 'notFoundRequiredParams',
  invalidValueRequiredParams = 'invalidValueRequiredParams',

  database = 'database',
  failedAuth = 'failedAuth',
  forbidden = 'forbidden',
  serverError = 'serverError',

  userNotFound = 'userNotFound',
  currencyNotFound = 'currencyNotFound',
  investInstrumentNotFound = 'investInstrumentNotFound',
  accountNotFound = 'accountNotFound',

  notEnoughFunds = 'notEnoughFunds',
  notEnoughLots = 'notEnoughLots',

  userIsAlreadyExists = 'userIsAlreadyExists',
  unknown = 'unknown',
}

export default ExceptionId;

