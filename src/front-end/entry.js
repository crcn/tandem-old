import 'babel-polyfill';

import BrowserApplication from './application';
import config from './config';

var app = window.app = BrowserApplication.create({
  config,
  zoom: 1
});

window.onload = async function () {

  app.setProperties({
    element: document.getElementById('app'),
  });

  await app.initialize();
};
