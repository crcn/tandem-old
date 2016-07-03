import ViewController from './controller';
import { create as createTemplate } from './template';

describe(__filename + '#', function() {
  it('can be created with a template', function() {
    var c = ViewController.create({
      template: createTemplate('hello')
    });

    expect(c.node.nodeValue).to.be('hello');
  });

  it('updates the node whenever the controller changes', function() {
    var c = ViewController.create({
      name: 'john',
      template: createTemplate('<span>hello {{name}}</span>')
    });

    expect(c.node.innerHTML).to.be('hello john');
    c.setProperties({ name: 'jeff' });
    expect(c.node.innerHTML).to.be('hello jeff');
  });

  it('can use a string as a template source', function() {
    var c = ViewController.create({
      name: 'a',
      template: `{{name}}`
    });

    expect(c.node.nodeValue).to.be('a');
  });
})
