import 'babel-polyfill';

import BrowserApplication from './application';

var app = window.app = BrowserApplication.create();

window.onload = function() {
  app.initialize();
}
