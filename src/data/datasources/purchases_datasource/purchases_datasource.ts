type CreatePurchaseData = {
  accountItemId: number;
  lots: number;
  price: number;
};

interface PurchasesDatasource {
  create: (data: CreatePurchaseData) => Promise<number>;
}

export default PurchasesDatasource;

