import 'babel-polyfill';

import BrowserApplication from './application';

var app = window.app = BrowserApplication.create();

window.onload = function() {

  app.setProperties({
      element: document.getElementById('app')
  });

  app.initialize();
}
