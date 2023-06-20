import MoneyEntity, { NANO_VALUE } from '../../../domain/entities/money_entity';
import CurrencyDepositModel from '../../../data/models/currency_deposit_model';

type Params = {
  balance: CurrencyDepositModel;
  price: MoneyEntity;
  lots: number;
  commission?: MoneyEntity;
};

const calculateBalance = ({
  balance,
  price,
  lots,
  commission,
}: Params): MoneyEntity => {
  console.log(balance, price, lots, commission);
  const nanoTemplate = price.nano * lots - (commission?.nano ?? 0);
  const nano = nanoTemplate % NANO_VALUE;
  const units =
    price.units * lots +
    Math.floor(nanoTemplate / NANO_VALUE) -
    (commission?.units ?? 0);
  const balanceNanoTemplate = balance.value_nano + nano;
  const balanceNano = balanceNanoTemplate % NANO_VALUE;
  const balanceUnits =
    balance.value_units + units + Math.floor(balanceNanoTemplate / NANO_VALUE);
  return {
    units: balanceUnits,
    nano: balanceNano,
  };
};

export default calculateBalance;

