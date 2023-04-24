import BaseModel from './base_model';

type PurchaseModel = BaseModel & {
    accountItemId: number;
    date: string;
    lots: number;
    price: number;
};

export default PurchaseModel;
