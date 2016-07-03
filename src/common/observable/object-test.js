import ObservableObject from './object';
import expect from 'expect.js';

describe(__filename + '#', () => {
  it('can be created', () => {
    var ref = ObservableObject.create();
    expect(ref).to.be.an(ObservableObject);
  });

  it('can be created with initial properties', () => {
    var ref = ObservableObject.create({ a: 'b', c: 'd' });
    expect(ref.a).to.be('b');
    expect(ref.c).to.be('d');
  }); 
});
