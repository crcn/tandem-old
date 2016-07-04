import Repeat from './index';
import { freeze, dom } from 'paperclip';

describe(__filename + '#', function() {
  it('can be created', function() {
    var tpl = freeze(<div><Repeat each={c=>c} as='item'>{c=>c.item}</Repeat></div>);
    var view = tpl.createView([1, 2, 3, 4]);

    view.context.pop();
    view.context[0] = 0;
    view.update();
    expect(view.node.outerHTML).to.be('div');
  });
});
