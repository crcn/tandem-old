
import { createTemplate, ViewController, dom } from '../';

describe(__filename + '#', function() {
  it('can be created with a template', function() {

    class SubController extends ViewController {
      static template = createTemplate('hello');
    }

    var c = SubController.create();

    expect(c.node.nodeValue).to.be('hello');
  });

  it('updates the node whenever the controller changes', function() {

    class SubController extends ViewController {
      name = 'john';
      static template = createTemplate('<span>hello {{name}}</span>');
    }

    var c = SubController.create();

    expect(c.node.innerHTML).to.be('hello john');
    c.setProperties({ name: 'jeff' });
    expect(c.node.innerHTML).to.be('hello jeff');
  });

  it('can use a string as a template source', function() {

    class SubController extends ViewController {
      name = 'john';
      static template = `{{name}}`
    }

    var c = SubController.create();

    expect(c.node.nodeValue).to.be('john');
  });

  it('can use JSX', function() {
    class SubController extends ViewController {
      name = 'jake';
      static template = <div>
        hello { c => c.name }
      </div>;
    }

    expect(SubController.create().node.outerHTML).to.be('<div>hello jake</div>');
  });
})
