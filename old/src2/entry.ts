import BrowserApplication from './application/index';
import { merge } from 'lodash'; 

const queryConfig = window.location.search && false ? JSON.parse(decodeURIComponent(window.location.search.substr(1))) : {};

var app = window['app'] = new BrowserApplication(merge({}, window['config'] || {}, queryConfig));

window.addEventListener('unhandledrejection', event => console.error(event));

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

  await app.initialize().then();
};
