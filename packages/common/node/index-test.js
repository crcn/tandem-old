import Node from './index';
import sift from 'sift';
import { CallbackNotifier } from 'common/notifiers';

describe(__filename + '#', function() {
  it('can be created', function() {
    Node.create();
  });

  it('can add a child node', function() {
    var node = Node.create();
    node.children.push(Node.create());
  });

  it('sets the parent of children that have been added', function() {
    var p = Node.create();
    var c = Node.create();
    p.children.push(c);
    expect(c.parent).to.be(p);
  });

  it('removes a node from another parent if added to another', function() {
    var p1 = Node.create();
    var p2 = Node.create();

    var c  = Node.create();
    p1.children.push(c);
    expect(c.parent).to.be(p1);

    p2.children.push(c);
    expect(c.parent).to.be(p2);
    expect(p1.children.length).to.be(0);
  });

  it('sets the parent to undefined of a removed child', function() {
    var p1 = Node.create();
    var p2 = Node.create();

    var c  = Node.create();
    p1.children.push(c);
    expect(c.parent).to.be(p1);

    p1.children.remove(c);
    expect(c.parent).to.be(void 0);
  });

  it('bubbles up a change', function() {
    var messages = [];
    var notifier = CallbackNotifier.create(messages.push.bind(messages));
    var n1 = Node.create({
      notifier: notifier
    });
    n1.children.push(Node.create());
    expect(messages.length).to.be(1);
    n1.children.remove(n1.children[0]);
    expect(messages.length).to.be(2);
  });

  it('can find a nested node', function() {

    var c;

    var n1 = Node.create({ name: 'ul' }, [
      Node.create({ name: 'li' }, [
        c = Node.create({ name: 'span' })
      ])
    ]);

    expect(n1.find(sift({ name: 'span' }))).to.be(c);
  });

  it('can filter for nested nodes', function() {

    var n1 = Node.create({ name: 'ul' }, [
      Node.create({ name: 'li' }, [
        Node.create({ name: 'span' }),
        Node.create({ name: 'span' }),
        Node.create({ name: 'span' })
      ]),
      Node.create({ name: 'li' }, [
        Node.create({ name: 'span' }, [
          Node.create({ name: 'span' })
        ])
      ])
    ]);

    var spans = n1.filter(sift({ name: 'span' }))
    expect(spans.length).to.be(5);
  });

  it('automatically sets the child notifier to the parent notifier', function() {
    var messages = [];
    var notifier = CallbackNotifier.create(messages.push.bind(messages));
    var c;
    var n1 = Node.create({ name: 'div', notifier: notifier }, [
      c = Node.create({ name: 'span' })
    ]);

    c.setProperties({ style: { backgroundColor: 0x000 }});
    expect(messages.length).to.be(2);
    var change = messages[0].changes[0];
    expect(change.target).to.be(c);
    expect(change.property).to.be('style');
    expect(change.newValue.backgroundColor).to.be(0x000);
  });
});
