import FragmentDictionary from './dictionary';

describe(__filename + '#', function() {
  it('can be created', function() {
    FragmentDictionary.create();
  });

  it('can register and query fragments', function() {
    var d = FragmentDictionary.create();
    d.register({ ns: 'a' });
    expect(d.query('a')[0].ns).to.be('a');
    expect(d.query('a/**')[0].ns).to.be('a');

    d.register({ ns: 'a/b' });
    expect(d.query('a').length).to.be(1);
    expect(d.query('a/**').length).to.be(2);
    expect(d.query('a/**')[1].ns).to.be('a/b');
  });
});
