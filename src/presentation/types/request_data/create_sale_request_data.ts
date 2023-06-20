import MoneyEntity from '../../../domain/entities/money_entity';

type CreateSaleRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: MoneyEntity;
  date?: string;
  commission?: MoneyEntity;
  addFundsFromSaleToBalance: boolean;
};

export default CreateSaleRequestData;

