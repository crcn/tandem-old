
import { TemplateComponent, dom, freeze } from '../';

describe(__filename + '#', function() {

  it('updates the node whenever the controller changes', function() {

    class SubController extends TemplateComponent {
      static template = '<span>hello {{attributes.name}}</span>';
    }

    var context = {
      name: 'john'
    };

    var c = freeze(<SubController name={c=>c.name}/>).createView(context);
    c.update();
    expect(c.section.toString()).to.be('<span>hello john</span>');
    context.name = 'jeff';
    c.update();
    expect(c.section.toString()).to.be('<span>hello jeff</span>');
  });
});
