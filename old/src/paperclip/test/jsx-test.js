import { dom, TemplateComponent, freeze, FragmentSection } from '../index';
import expect from 'expect.js';


describe(__filename + '#', function() {
  return;
  it('can render various elements', function() {
    class SubController extends TemplateComponent {
      static template = <div className='some-class'>
        hello {c => c.name}
      </div>
    }

    var c = freeze(<SubController name='joe' />);

    var v = c.create();
    v.render();
    expect(v.section.toString()).to.be(`<div class=\"some-class\">hello joe</div>`);
  });

  it('can render with a component', function() {

    class Repeat {

      constructor({ view, context, childNodesTemplate }) {
          this.view               = view;
          this.context            = context;
          this.childNodesTemplate = childNodesTemplate;
      }

      setAttribute(key, value) {
        this.context[key] = value;
      }

      update() {
        var { section }         = this.view;
        var { each, as }        = this.context;
        var childNodesTemplate  = this.childNodesTemplate;

        each.forEach(function(item, index) {
          section.appendChild(childNodesTemplate.create({
            [as]: item
          }).render());
        });
      }
    }

    class SubController extends TemplateComponent {
      static template = <Repeat each={c=>c.items} as='item'>
        item: {c=>c.item}
      </Repeat>
    }

    var c = freeze(<SubController items={[1, 2, 3, 4]} />);
    var v = c.create();
    v.render();
    expect(v.section.toString()).to.be('item: 1item: 2item: 3item: 4');
  });
});
