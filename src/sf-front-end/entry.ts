import config from './config';
import FrontEndApplication from './application';

const app = window['app'] = new FrontEndApplication(config);

window.onload = () => app.initialize();