import { freeze, compileXMLtoJS, createVNode, dom, BaseComponent } from '../index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  return;

  [
    ['<div />', {}, '<div></div>'],
    ['hello world', {}, 'hello world'],
    ['hello {{name}}', { name: 'john' }, 'hello john'],
    ['hello {{firstName}} {{lastName}}', { firstName: 'billy', lastName: 'bob' }, 'hello billy bob']
  ].forEach(function([source, context, expectation]) {
    it(`can parse ${source}`, function() {
      var div = document.createElement('div');
      div.appendChild(freeze(compileXMLtoJS(source)(createVNode)).create(context).render());
      expect(div.innerHTML).to.be(expectation);
    });
  });

  it('recycles views that have been disposed of', function() {
    var tpl = freeze(compileXMLtoJS('hello {{jeff}}')(createVNode));
    var view = tpl.create({ name: 'jeff' });
    view.dispose();
    expect(tpl.create({ name: 'joe' })).to.be(view);

    // sanity. Ensure that pool properly drains
    expect(tpl.create({ name: 'jake' })).not.to.be(view);
  });

  it('can pass a registered component when freezing', function() {

    class CustomComponent extends BaseComponent {
      initialize() {
        this.section.appendChild(document.createTextNode(this.context.message));
      }
    }

    var tpl = freeze(<custom-component message="hello custom component!" />, {
      componentFactories: {
        'custom-component': CustomComponent
      }
    });

    var view = tpl.create();
    view.render();
    expect(view.toString()).to.be('hello custom component!');
  })
});
