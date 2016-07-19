import 'babel-polyfill';
import ServerApplication from './application';
import config from './config';
var app = ServerApplication.create({ config });

process.on('unhandledRejection', function(error) {
  console.log('unhandled rejection', error);
});

app.initialize();

module.exports = app;
