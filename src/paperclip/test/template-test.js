import { createTemplate } from '../index';
import expect from 'expect.js';

describe(__filename + '#', function() {

  [
    ['<div />', {}, '<div></div>'],
    ['hello world', {}, 'hello world'],
    ['hello {{name}}', { name: 'john' }, 'hello john'],
    ['hello {{firstName}} {{lastName}}', { firstName: 'billy', lastName: 'bob' }, 'hello billy bob']
  ].forEach(function([source, context, expectation]) {
    it(`can parse ${source}`, function() {
      var div = document.createElement('div');
      div.appendChild(createTemplate(source).createView(context).toFragment());
      expect(div.innerHTML).to.be(expectation);
    });
  });

  it('throws an error if a factory does not exist', function() {
    expect(function() {
      createTemplate(function(create) {
        return create('blarg');
      })
    }).to.throwError();
  });

  it('recycles views that have been disposed of', function() {
    var tpl = createTemplate('hello {{name}}');
    var view = tpl.createView({ name: 'jeff' });
    view.dispose();
    expect(tpl.createView({ name: 'joe' })).to.be(view);

    // sanity. Ensure that pool properly drains
    expect(tpl.createView({ name: 'jake' })).not.to.be(view);
  });
});
