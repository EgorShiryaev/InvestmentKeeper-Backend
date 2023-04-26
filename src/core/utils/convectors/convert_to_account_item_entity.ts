import AccountItemFullModel from '../../../data/models/account_item_full_model';
import AccountItemEntity from '../../../domain/entities/account_item_entity';
import convertToInvestInstrumentEntity from './convert_to_invest_instrument_entity';

const convertToAccountItemEntity = (
  model: AccountItemFullModel,
  currentPrice?: number,
): AccountItemEntity => {
  return {
    id: model.accountItemId,
    lots: model.accountItemLots,
    averagePurchasePrice: model.accountItemAveragePurchasePrice,
    instrument: convertToInvestInstrumentEntity(model),
    currentPrice: currentPrice,
  };
};

export default convertToAccountItemEntity;

