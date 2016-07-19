import 'babel-polyfill';

import BrowserApplication from './application';
import config from './config';
import { merge } from 'lodash'; 

const queryConfig = window.location.search && false ? JSON.parse(decodeURIComponent(window.location.search.substr(1))) : {};

var app = window['app'] = BrowserApplication.create({
  config: merge({}, config, queryConfig),
  zoom: 1
});

window.onload = async function () {

  for (var bundleName in window['Saffron']) {
    var bundle = window['Saffron'][bundleName];
    if (!bundle.fragment) continue;
    app.logger.info('registering bundle %s', bundleName);
    app.fragments.register(bundle.fragment);
  }

  app.setProperties({
    element: document.getElementById('app')
  });

  await app.initialize();
};
