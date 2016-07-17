import 'babel-polyfill';

import BrowserApplication from './application';
import config from './config';
import merge from 'lodash/object/merge';

const queryConfig = window.location.search && false ? JSON.parse(decodeURIComponent(window.location.search.substr(1))) : {};

var app = window.app = BrowserApplication.create({
  config: merge({}, config, queryConfig),
  zoom: 1
});

window.onload = async function () {

  app.setProperties({
    element: document.getElementById('app'),
  });

  await app.initialize();
};
