import 'babel-polyfill';
import ServerApplication from './application';
import config from './config';
var app = ServerApplication.create({ config });

app.initialize();

module.exports = app;
