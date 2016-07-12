import BrowserApplication from 'browser/application';
// import HTMLElementEntity from 'html-fragment/entities/element';

describe(__filename + '#', function () {

  var app;

  beforeEach(async function () {
    app = BrowserApplication.create();
    await app.initialize();
  });
});
