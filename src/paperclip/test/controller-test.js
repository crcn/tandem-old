
import { TemplateComponent, dom, freeze } from '../';

var React = {
  createElement: dom
}

describe(__filename + '#', function() {

  it('updates the node whenever the controller changes', function() {

    class SubController extends TemplateComponent {
      static template = '<span>hello {{name}}</span>';
    }

    var context = {
      name: 'john'
    };

    var c = freeze(<SubController name={c=>c.name}/>).create(context);
    c.update();
    expect(c.section.toString()).to.be('<span>hello john</span>');
    context.name = 'jeff';
    c.update();
    expect(c.section.toString()).to.be('<span>hello jeff</span>');
  });
});
