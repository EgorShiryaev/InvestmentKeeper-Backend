type CreatePurchaseRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
  withdrawFundsFromCurrencyBalance: boolean;
};

export default CreatePurchaseRequestData;

