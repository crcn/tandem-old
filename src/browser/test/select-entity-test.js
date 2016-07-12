import BrowserApplication from 'browser/application';
// import HTMLElementEntity from 'html-fragment/entities/element';

describe(__filename + '#', function () {

  var app;

  beforeEach(async function () {
    app = BrowserApplication.create();
    await app.initialize();
  });

  xit('can select a simple div', function () {
    var entity = HTMLElementEntity.create({
      name: 'div',
      style: {
        backgroundColor: 'red',
        width: '100px',
        height: '100px',
      },
    });


  });
});
