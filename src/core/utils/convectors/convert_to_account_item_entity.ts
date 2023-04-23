import AccountItemFullModel from '../../../data/models/account_item_full_model';
import AccountItemEntity from '../../../domain/entities/account_item_entity';
import convertToInvestInstrumentEntity from './convert_to_invest_instrument_entity';

const convertToAccountItemEntity = (
  model: AccountItemFullModel,
): AccountItemEntity => {
  return {
    id: model.accountItemId,
    lots: model.accountItemLots,
    averagePrice: model.accountItemAveragePrice,
    instrument: convertToInvestInstrumentEntity(model),
  };
};

export default convertToAccountItemEntity;

