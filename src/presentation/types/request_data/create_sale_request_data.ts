type CreateSaleRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
  addFundsFromSaleToBalance: boolean;
};

export default CreateSaleRequestData;

