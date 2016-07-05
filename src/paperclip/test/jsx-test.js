import { dom, TemplateComponent, freeze, FragmentSection } from '../index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can render various elements', function() {
    class SubController extends TemplateComponent {
      static template = <div class='some-class'>
        hello {c => c.attributes.name}
      </div>
    }

    var c = freeze(<SubController name='joe' />);

    var v = c.createView();
    v.render();
    expect(v.section.toString()).to.be(`<div class=\"some-class\">hello joe</div>`);
  });

  it('can render with a component', function() {

    class Repeat {

      constructor({ view, attributes, childNodesTemplate }) {
          this.view               = view;
          this.attributes         = Object.assign({}, attributes);
          this.childNodesTemplate = childNodesTemplate;
      }

      setAttribute(key, value) {
        this.attributes[key] = value;
      }

      update() {
        var { section, context }   = this.view;
        var { each, as }        = this.attributes;
        var childNodesTemplate  = this.childNodesTemplate;

        each.forEach(function(item, index) {
          section.appendChild(childNodesTemplate.createView({
            [as]: item
          }).render());
        });
      }
    }

    class SubController extends TemplateComponent {
      static template = <Repeat each={c=>c.attributes.items} as='item'>
        item: {c=>c.item}
      </Repeat>
    }

    var c = freeze(<SubController items={[1, 2, 3, 4]} />);
    var v = c.createView();
    v.render();
    expect(v.section.toString()).to.be('item: 1item: 2item: 3item: 4');
  });
});
