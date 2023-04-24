type CreateSaleData = {
  accountItemId: number;
  lots: number;
  price: number;
};

interface SalesDatasource {
  create: (data: CreateSaleData) => Promise<number>;
}

export default SalesDatasource;

