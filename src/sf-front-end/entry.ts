import './scss/modules/all.scss';
import './scss/fonts.scss';

import config from './config';
import FrontEndApplication from './application';



window.onload = () => {
  const app = window['app'] = new FrontEndApplication(Object.assign(config, {
    element: document.getElementById('app')
  }));
  app.initialize();
}