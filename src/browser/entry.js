import 'babel-polyfill';

import BrowserApplication from './application';
import config from './config';

var app = window.app = BrowserApplication.create({ config });

window.onload = async function () {

  app.setProperties({
    element: document.getElementById('app'),
  });

  await app.initialize();

  app.logger.info('initialized');
};
