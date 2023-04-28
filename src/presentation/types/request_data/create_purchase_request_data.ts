type CreatePurchaseRequestData = {
  accountId: number;
  instrumentId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
  withdrawFundsFromBalance: boolean;
};

export default CreatePurchaseRequestData;

