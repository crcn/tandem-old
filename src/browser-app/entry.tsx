import Application from './application';

window.onload = () => {
  let app = new Application({
    element: document.getElementById('element')
  });
  app.initialize();
}
