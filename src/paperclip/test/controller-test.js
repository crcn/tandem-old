
import { createTemplate, TemplateComponent, dom } from '../';

describe(__filename + '#', function() {
  it('can be created with a template', function() {

    class SubController extends TemplateComponent {
      static template = createTemplate('hello');
    }

    var c = SubController.create();

    expect(c.section.toString()).to.be('hello');
  });

  it('updates the node whenever the controller changes', function() {

    class SubController extends TemplateComponent {
      name = 'john';
      static template = createTemplate('<span>hello {{name}}</span>');
    }

    var c = SubController.create();

    expect(c.section.toString()).to.be('<span>hello john</span>');
    c.setProperties({ name: 'jeff' });
    expect(c.section.toString()).to.be('<span>hello jeff</span>');
  });

  it('can use a string as a template source', function() {

    class SubController extends TemplateComponent {
      name = 'john';
      static template = `{{name}}`
    }

    var c = SubController.create();

    expect(c.section.toString()).to.be('john');
  });

  it('can use JSX', function() {
    class SubController extends TemplateComponent {
      name = 'jake';
      static template = <div>
        hello { c => c.name }
      </div>;
    }

    expect(SubController.create().section.toString()).to.be('<div>hello jake</div>');
  });
})
