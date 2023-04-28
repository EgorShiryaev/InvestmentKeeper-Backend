import currency from 'currency.js';

const calculateAccountTotalCommission = (
  accountTotalCommission: number,
  commission?: number,
) => {
  return commission !== undefined
    ? currency(accountTotalCommission + commission).value
    : undefined;
};

export default calculateAccountTotalCommission;

