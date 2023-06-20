import MoneyEntity from '../../../domain/entities/money_entity';

type CreateFinancialOperationData = {
  accountId: number;
  currencyId: number;
  value: MoneyEntity;
  date?: string;
};

interface FinancialOperationsDatasource {
  create: (data: CreateFinancialOperationData) => Promise<number>;
}

export default FinancialOperationsDatasource;

