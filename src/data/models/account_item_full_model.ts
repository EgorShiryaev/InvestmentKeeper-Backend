import BaseModel from './base_model';

type AccountItemFullModel = BaseModel & {
  id: number;
  lots: number;
  averagePrice: number;
  instrumentId: number;
  instrumentFigi: string;
  instrumentTicker: string;
  instrumentTitle: string;
  instrumentLot: number;
  instrumentAbout: string;
  instrumentType: string;
  instrumentCurrency: string;
};

export default AccountItemFullModel;

