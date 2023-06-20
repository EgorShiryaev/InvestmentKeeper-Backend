import MoneyEntity from '../../../domain/entities/money_entity';
import CurrencyDepositFullModel from '../../models/currency_deposit_full_model';
import CurrencyDepositModel from '../../models/currency_deposit_model';

export type GetAllCurrencyDepositsData = {
  accountId: number;
};

export type GetCurrencyDeposit = {
  accountId: number;
  currencyId: number;
};

export type CreateCurrencyDepositData = {
  accountId: number;
  currencyId: number;
};

export type UpdateCurrencyDepositData = {
  id: number;
  value: MoneyEntity,
};

interface CurrencyDepositsDatasource {
  getAllByAccountId: (
    data: GetAllCurrencyDepositsData,
  ) => Promise<CurrencyDepositFullModel[]>;
  getByAccountIdAndCurrencyId: (
    data: GetCurrencyDeposit,
  ) => Promise<CurrencyDepositModel | undefined>;
  create: (data: CreateCurrencyDepositData) => Promise<number>;
  update: (data: UpdateCurrencyDepositData) => Promise<void>;
}

export default CurrencyDepositsDatasource;

