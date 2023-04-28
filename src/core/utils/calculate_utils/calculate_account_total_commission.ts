import currency from 'currency.js';

const calculateAccountTotalCommision = (
  accountTotalCommision: number,
  commision?: number,
) => {
  return commision !== undefined
    ? currency(accountTotalCommision + commision).value
    : undefined;
};

export default calculateAccountTotalCommision;

