type CreateSaleRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: number;
  date?: string;
  commision?: number;
  addFundsFromSaleToBalance: boolean
};

export default CreateSaleRequestData;

