import InvestInstrumentTypeEntity from '../../../domain/entities/invest_instrument_type_entity';

const convertToInvestInstrumentTypeEntity = (
  type: string,
): InvestInstrumentTypeEntity => {
  switch (type) {
  case 'stock':
    return InvestInstrumentTypeEntity.stock;
  }
  return InvestInstrumentTypeEntity.stock;
};

export default convertToInvestInstrumentTypeEntity;
