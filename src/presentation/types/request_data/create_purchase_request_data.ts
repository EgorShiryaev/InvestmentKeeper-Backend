import MoneyEntity from '../../../domain/entities/money_entity';

type CreatePurchaseRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: MoneyEntity;
  date?: string;
  commission?: MoneyEntity;
  withdrawFundsFromBalance: boolean;
};

export default CreatePurchaseRequestData;

