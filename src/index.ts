import dependencyInjection from './core/dependency_injection/dependency_injection';

dependencyInjection()
  .then((app) => app.run())
  .catch((e) => console.log(e));

