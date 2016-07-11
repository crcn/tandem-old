import { dom, freeze, TemplateComponent } from '../index';
import CoreObject from 'common/object';

var React = {
  createElement: dom
}

describe(__filename + '#', function() {
  it('can attach a context factory to a component', function() {
    class TestComponent extends TemplateComponent {
      static template = <div>
        {c=>c.getMessage()}
      </div>

      static controllerFactory = class extends CoreObject {
        getMessage() {
          return `hello ${this.text}`;
        }
      }
    }

    var view = freeze(<TestComponent text='world' />).create();
    view.render();
    expect(view.toString()).to.be('<div>hello world</div>');
  });
});
