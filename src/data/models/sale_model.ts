import BaseModel from './base_model';

type SaleModel = BaseModel & {
  accountItemId: number;
  date: string;
  lots: number;
  price: number;
  commission: number;
};

export default SaleModel;

