import ObservableObject from './object';
import expect from 'expect.js';

describe(__filename + '#', () => {
  it('can be created', () => {
    var ref = ObservableObject.create();
    expect(ref).to.be.an(ObservableObject);
  });
});
