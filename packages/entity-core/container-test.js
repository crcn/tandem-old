import expect from 'expect.js';
import Container from './container';
import Entity from './base';

describe(__filename + '#', function() {

  it('can be created', function() {
    new Container();
  });

  it('can be created with children', function() {

    var c = new Container({
      children: [
        new Entity({ name: 'a' }),
        new Entity({ name: 'b' })
      ]
    });

    expect(c.children.length).to.be(2);
    expect(c.children[0].parent).to.be(c);
  });

  it('updates a child parent if dynamically added to container', function() {
    var c = new Container();
    c.addChild(new Entity({ name: 'a' }));
    expect(c.children[0].name).to.be('a');
    expect(c.children[0].parent).to.be(c);
  });

  it('removes a child from the previous parent if it exists', function() {

    var c = new Container();
    c.addChild(new Entity({ name: 'a' }))
    var c2 = new Container({
      children: [c.children[0]]
    });

    expect(c2.children[0].parent).to.be(c2);
    expect(c.children.length).to.be(0);
  })
});
