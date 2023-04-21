import OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import dependencyInjection from './dependency_injection';
import getInvestmentInstruments from './core/utils/tinkoff_invest_api/get_investment_instruments';
import fs from 'fs';
import 'dotenv/config';
import InvestmentInstrumentsLocalDatasource from './data/datasources/investment_instruments_datasource/investment_instruments_local_datasource';
import path from 'path';
import sqlDatabaseDependencyInjection from './core/dependency_injection/sql_database/sql_database_dependency_injection';
import { promises } from 'dns';

// dependencyInjection()
//   .then((app) => app.run())
//   .catch((e) => console.log(e));

const apiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox'; // Для Production-окружения будет https://api-invest.tinkoff.ru/openapi
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = process.env.SANDBOX_TINKOFF_TOKEN; //

getInvestmentInstruments(
  new OpenAPI({
    apiURL: apiURL,
    socketURL: socketURL,
    secretToken: secretToken,
  }),
)
  .then(async (v) => {
    const dbPath = `../database/${process.env.ENV}.db`;
    const databasePath = path.resolve(__dirname, dbPath);

    const sqlDatabase = await sqlDatabaseDependencyInjection(databasePath);

    const instrumnetsLocalDatasource = InvestmentInstrumentsLocalDatasource({
      sqlDatabase,
    });

    const promises = v.map((v) => instrumnetsLocalDatasource.create(v));

    return Promise.all(promises).then(() => v);
  })
  .then((stocks) => {
    console.log('stocks', stocks.length);
    fs.writeFile('stocks.json', JSON.stringify(stocks), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('success');
      }
    });
  })
  .catch((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('success');
    }
  });

