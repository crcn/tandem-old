import expect from 'expect.js';
import FragmentCollection from './collection';

describe(__filename + '#', function () {
  it('can be created', function () {
    FragmentCollection.create();
  });

  it('can register and query fragments', function () {
    var d = FragmentCollection.create();
    d.register({ ns: 'a' });
    expect(d.queryAll('a')[0].ns).to.be('a');
    expect(d.queryAll('a/**')[0].ns).to.be('a');

    d.register({ ns: 'a/b' });
    expect(d.queryAll('a').length).to.be(1);
    expect(d.queryAll('a/**').length).to.be(2);
    expect(d.queryAll('a/**')[1].ns).to.be('a/b');
  });
});
