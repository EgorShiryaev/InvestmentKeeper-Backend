type CreateFinancialOperationData = {
  accountId: number;
  currencyId: number;
  value: number;
  date?: string;
};

interface FinancialOperationsDatasource {
  create: (data: CreateFinancialOperationData) => Promise<number>;
}

export default FinancialOperationsDatasource;

