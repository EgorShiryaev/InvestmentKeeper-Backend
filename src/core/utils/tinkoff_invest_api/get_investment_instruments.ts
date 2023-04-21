import OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import InvestmentInstrument from '../../../domain/entities/investment_instrument/investment_instrument';
import convertToInvestmentInstrument from './convectors/convert_to_investment_instrument';

const getInvestmentInstruments = async (
  api: OpenAPI,
): Promise<InvestmentInstrument[]> => {
  const loadedInstruments = await Promise.all([
    loadStocks(api),
    // loadBonds(api),
    // loadEtfs(api),
  ]).then((v) => v.flat());

  const convertedInstruments = loadedInstruments
    .filter((v) => v.currency === 'RUB')
    .map((value) => convertToInvestmentInstrument(value));

  return convertedInstruments;
};

const loadStocks = (api: OpenAPI) => {
  return api.stocks().then((v) => {
    console.log('Stocks loaded:', v.total);
    return v.instruments;
  });
};
const loadBonds = (api: OpenAPI) => {
  return api.bonds().then((v) => {
    console.log('Bonds loaded:', v.total);
    return v.instruments;
  });
};
const loadEtfs = (api: OpenAPI) => {
  return api.etfs().then((v) => {
    console.log('Etfs loaded:', v.total);
    return v.instruments;
  });
};

export default getInvestmentInstruments;
