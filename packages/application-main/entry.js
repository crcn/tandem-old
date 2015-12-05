import 'babel-polyfill';
import Application from './index';

var app = global.app = new Application();

window.onload = () => app.initialize({
  element: document.getElementById('application')
});
