import BrowserApplication from './Application';

window.onload = () => {

  let app = BrowserApplication.create({
    element: document.getElementById('application')
  });

  app.initialize();
}