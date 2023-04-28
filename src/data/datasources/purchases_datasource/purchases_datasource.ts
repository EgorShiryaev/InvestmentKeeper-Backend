type CreatePurchaseData = {
  accountItemId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
};

interface PurchasesDatasource {
  create: (data: CreatePurchaseData) => Promise<number>;
}

export default PurchasesDatasource;

