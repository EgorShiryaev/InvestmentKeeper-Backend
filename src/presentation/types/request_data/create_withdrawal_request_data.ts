import MoneyEntity from '../../../domain/entities/money_entity';

type CreateWithdrawalRequestData = {
  accountId: number;
  value: MoneyEntity;
  currency: string;
  date?: string;
};

export default CreateWithdrawalRequestData;
