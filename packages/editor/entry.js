import 'babel-polyfill';
import Application from './app';

var app = global.app = new Application();

window.onload = () => app.initialize({
  element: document.getElementById('app')
});
