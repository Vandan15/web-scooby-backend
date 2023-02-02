const fs = require('fs'),
  nconf = require('nconf'),
  NODE_ENV = process.env.NODE_ENV || 'local';

nconf
  .argv()
  .env()
  .file({ file: `src/config/app/config.${NODE_ENV}.json` });

const AppConfig = {};

AppConfig.databaseUrl = (() => {
  const dbConfig = nconf.get('database');
  const url = dbConfig.url.replace('<password>', dbConfig.password);
  return url;
})();

AppConfig.port = (() => {
  return nconf.get('port');
})();

AppConfig.host = (() => {
  return nconf.get('host');
})();

module.exports = AppConfig;
