type CreateSaleData = {
  accountItemId: number;
  lots: number;
  price: number;
  date?: string;
  commission?: number;
};

interface SalesDatasource {
  create: (data: CreateSaleData) => Promise<number>;
}

export default SalesDatasource;

