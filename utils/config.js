const ENV = {
  dev: {
    baseUrl: 'http://localhost:8080'
  },
  prod: {
    baseUrl: 'https://api.miaobill.com'
  }
};

const currentEnv = 'dev';

module.exports = {
  baseUrl: ENV[currentEnv].baseUrl
};
