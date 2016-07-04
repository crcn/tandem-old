import Repeat from './index';
import { freeze, dom } from 'paperclip';

describe(__filename + '#', function() {
  it('can be created', function() {
    var tpl = freeze(<Repeat each={c=>c} as='item'>{c=>c.item}</Repeat>);

    var view = tpl.createView([1, 2, 3, 4]);

    view.context.pop();
    view.context[0] = 0;
    view.update();
    expect(view.section.toString()).to.be('023');
  });

  it('can be multi-nested', function() {
    var tpl = freeze(<Repeat each={a=>a} as='b'>
      <Repeat each={c=>c.b} as='c'>
        {c=>c.c}
      </Repeat>
    </Repeat>);

    var view = tpl.createView([[1, 2], ['a', 'b'], ['111', '222']]);

    expect(view.section.toString()).to.be('12ab111222');
  })
});
