type CreateSaleRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
  addFundsFromSaleToCurrencyBalance: boolean;
};

export default CreateSaleRequestData;

