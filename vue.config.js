const {beforeMiddleware} = require('./src/server/configure');


module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "devServer": {
    before: beforeMiddleware,
    "https": true
  }
};
