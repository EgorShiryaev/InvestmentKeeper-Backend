enum ExceptionId {
  invalidPhoneFormat = 'invalidPhoneFormat',
  invalidDateDormat = 'invalidDateDormat',
  invalidCandleTimesize = 'invalidCandleTimesize',

  database = 'database',
  failedAuth = 'failedAuth',
  forbidden = 'forbidden',
  serverError = 'serverError',

  notFoundRequiredParams = 'notFoundRequiredParams',
  invalidValueRequiredParams = 'invalidValueRequiredParams',

  userNotFound = 'userNotFound',
  currencyNotFound = 'currencyNotDound',
  investInstrumentNotFound = 'investInstrumentNotFound',
  accountNotFound = 'accountNotFound',
  assetNotFound = 'assetNotFound',

  notEnoughFunds = 'notEnoughFunds',
  notEnoughLots = 'notEnoughLots',

  userIsAlreadyExists = 'userIsAlreadyExists',

}

export default ExceptionId;

