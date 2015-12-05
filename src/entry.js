import Application from './application';

var app = global.app = new Application();

window.onload = () => app.initialize({
  element: document.getElementById('application')
});
