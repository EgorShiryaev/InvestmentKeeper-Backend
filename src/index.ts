import dependencyInjection from './core/dependency_injection/dependency_injection';

const secretToken = process.env.SANDBOX_TINKOFF_TOKEN;

dependencyInjection({
  tinkoffSecretToken: secretToken,
})
  .then((app) => app.run())
  .catch((e) => console.log(e));

