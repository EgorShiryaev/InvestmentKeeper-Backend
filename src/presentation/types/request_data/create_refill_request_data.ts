import MoneyEntity from '../../../domain/entities/money_entity';

type CreateRefillRequestData = {
  accountId: number;
  value: MoneyEntity;
  currency: string;
  date?: string;
};

export default CreateRefillRequestData;
