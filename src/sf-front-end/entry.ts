import './scss/modules/all.scss';
import './scss/fonts.scss';

import config from './config';
import FrontEndApplication from './application';
import { isMaster, fork } from 'sf-core/workers';

// none for now - need to figure out NULL exceptions with
// workers.
const NUM_WORKERS = 0;

if (isMaster) {

  window.onload = () => {
    const app = window['app'] = new FrontEndApplication(Object.assign(config, {
      element: document.getElementById('app')
    }));
    app.initialize();
  }

  for (let i = NUM_WORKERS; i--;) fork();
}