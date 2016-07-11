import 'babel-polyfill';

import BrowserApplication from './application';
import config from './config';

var app = window.app = BrowserApplication.create({ config });

window.onload = function() {

  app.setProperties({
      element: document.getElementById('app')
  });

  app.initialize();
}
