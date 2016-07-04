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
});
