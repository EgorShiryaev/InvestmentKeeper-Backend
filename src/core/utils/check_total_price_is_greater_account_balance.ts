import CurrencyDepositModel from '../../data/models/currency_deposit_model';
import MoneyEntity from '../../domain/entities/money_entity';
import calculateTotalPrice from './calculate_utils/calculate_total_price';
import aPlusB from './money_utils/a_plus_b';
import isAGreaterB from './money_utils/is_a_greater_b';

const checkTotalPriceIsGreaterAccountBalance = (
  price: MoneyEntity,
  deposit: CurrencyDepositModel,
  lots: number,
  commission?: MoneyEntity,
) => {
  const totalPrice = calculateTotalPrice({
    price: price,
    lots: lots,
  });
  const totalPriceWithCommision = commission
    ? aPlusB(totalPrice, commission)
    : totalPrice;
  return isAGreaterB(totalPriceWithCommision, {
    units: deposit.value_units,
    nano: deposit.value_nano,
  });
};

export default checkTotalPriceIsGreaterAccountBalance;

