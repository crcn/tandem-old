import { FragmentSection, dom, freeze } from '../index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  return;
  it('can be created', function() {
    var section = FragmentSection.create();
  });

  it('can return all the child nodes within a section', function() {
    var div = document.createElement('div');

    var section = FragmentSection.create();

    section.appendChild(freeze([1, 2, 3].map(function(int) {
      return <div>{int}</div>;
    })).section.toFragment());

    div.appendChild(section.toFragment());
    div.appendChild(document.createTextNode('hello'));

    expect(section.innerHTML).to.be('<div>1</div><div>2</div><div>3</div>');
    expect(div.innerHTML).to.be('<div>1</div><div>2</div><div>3</div>hello');
  })
});
