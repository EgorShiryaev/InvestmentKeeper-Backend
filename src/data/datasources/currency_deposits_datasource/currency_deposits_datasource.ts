import CurrencyDepositFullModel from '../../models/currency_deposit_full_model';
import CurrencyDepositModel from '../../models/currency_deposit_model';

export type GetAllCurrencyDepositsData = {
  accountId: number;
};

export type CreateCurrencyDepositData = {
  accountId: number;
  currencyId: number;
  value?: number;
};

export type UpdateCurrencyDepositData = {
  id: number;
  value: number;
};

export type GetCurrencyDeposit = {
  accountId: number;
  currencyId: number;
};

interface CurrencyDepositsDatasource {
  getAllByAccountId: (
    data: GetAllCurrencyDepositsData,
  ) => Promise<CurrencyDepositFullModel[]>;
  create: (data: CreateCurrencyDepositData) => Promise<number>;
  update: (data: UpdateCurrencyDepositData) => Promise<number>;
  getByAccountIdAndCurrencyId: (
    data: GetCurrencyDeposit,
  ) => Promise<CurrencyDepositModel | undefined>;
}

export default CurrencyDepositsDatasource;

