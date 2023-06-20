
import MoneyEntity from '../../../domain/entities/money_entity';
import InvestmentAssetFullModel from '../../models/investment_asset_full_model';
import InvestmentAssetModel from '../../models/investment_asset_model';

type CreateInvestmentAssetData = {
  accountId: number;
  instrumentId: number;
};

type UpdateInvestmentAssetData = {
  id: number;
  lots: number;
  averagePurchasePrice?: MoneyEntity;
  averageExchangeRate?: MoneyEntity;
};

interface InvestmentAssetsDatasource {
  getAllByAccountIdAndLotsGreaterZero: (
    accountId: number,
  ) => Promise<InvestmentAssetFullModel[]>;
  getByAccountIdAndInstrumentId: (
    accountId: number,
    instrumentId: number,
  ) => Promise<InvestmentAssetModel | undefined>;
  create: (data: CreateInvestmentAssetData) => Promise<number>;
  update: (data: UpdateInvestmentAssetData) => Promise<void>;
  getById: (id: number) => Promise<InvestmentAssetModel | undefined>;
}

export default InvestmentAssetsDatasource;

