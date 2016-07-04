import { dom, ViewController, freeze } from '../index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can render various elements', function() {
    class SubController extends ViewController {
      static template = <div class='some-class'>
        hello {c => c.name}
      </div>
    }

    var c = SubController.create({ name: 'joe' });
    expect(c.node.outerHTML).to.be(`<div class=\"some-class\">hello joe</div>`);
  });

  it('can render with a component', function() {

    class Repeat {

      constructor({ view, attributes, childNodesTemplate }) {
          this.view               = view;
          this.attributes         = attributes;
          this.childNodesTemplate = childNodesTemplate;
      }

      static freeze(options) {
        return document.createElement('div');
      }

      update() {
        var { node, context }   = this.view;
        var { each, as }        = this.attributes;
        var childNodesTemplate  = this.childNodesTemplate;

        each(context).forEach(function(item, index) {
          node.appendChild(childNodesTemplate.createView({
            [as]: item
          }).node);
        });
      }
    }

    class SubController extends ViewController {
      static template = <div>
        <Repeat each={c=>c.items} as='item'>
          item: {c=>c.item}
        </Repeat>
      </div>
    }

    var c = SubController.create({ items: [1, 2, 3, 4 ]});

    expect(c.node.outerHTML).to.be('<div><div>item: 1item: 2item: 3item: 4</div></div>');
  });
});
