import CurrencyModel from '../../models/currency_model';

export type GetCurrency = {
  value: string;
};

interface CurrenciesDatasource {
  get: (data: GetCurrency) => Promise<CurrencyModel | undefined>;
}

export default CurrenciesDatasource;
