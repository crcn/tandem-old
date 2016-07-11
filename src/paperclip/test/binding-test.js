import { dom, freeze, createHTMLBinding, BaseComponent } from '../index';
import CoreObject from 'common/object';
import { SequenceBus } from 'mesh';
import observable from 'common/object/mixins/observable';

describe(__filename + '#', function() {
  return;

  @observable
  class ObservableObject extends CoreObject {

  }

  it('can bind to a simple property', function() {
    var context = ObservableObject.create({ name: 'jake', bus: SequenceBus.create() });
    var div = freeze(<div>hello {c=>c.name}</div>).create(context);
    context.bus.push(div);
    div.render();
    expect(div.toString()).to.be('<div>hello jake</div>');
    context.setProperties({ name: 'joe' });
    expect(div.toString()).to.be('<div>hello joe</div>');
  });

  it('can bind to an attribute', function() {
    var context = ObservableObject.create({ color: 'red', bus: SequenceBus.create() });
    var div = freeze(<div style={function({ color }) {
      return `color:${color}`;
    }}></div>).create(context);

    context.bus.push(div);
    div.render();
    expect(div.toString()).to.be('<div style="color:red"></div>');
    context.setProperties({ color: 'blue' });
    expect(div.toString()).to.be('<div style="color:blue"></div>');
  });

  it('can bind to a component attribute', function() {

    class HelloComponent extends BaseComponent {
      static freezeNode() {
        return document.createTextNode('');
      }
      update() {
        super.update();
        this.section.targetNode.nodeValue =  `hello ${this.context.text}`;
      }
    }

    var bus = SequenceBus.create();

    var context = ObservableObject.create({ text: 'world', bus: bus });
    var view = freeze(<HelloComponent text={function({ text }) { return text; }} />).create(context);
    expect(view.toString()).to.be('');
    bus.push(view);
    view.render();
    expect(view.toString()).to.be('hello world');
    context.setProperties({ text: 'b' });
    expect(view.toString()).to.be('hello b');
  });

  xit('can map a DOM node', function() {

    var context = ObservableObject.create({ node: document.createTextNode('a') });

    var view = freeze(createHTMLBinding('node', function(node) {
      return node;
    })).create(context);

    view.render();

    expect(view.toString()).to.be('a');

    context.setProperties({ node: document.createTextNode('b') });

    expect(view.toString()).to.be('a');
    expect(view.toString()).to.be('b');
  });
});
