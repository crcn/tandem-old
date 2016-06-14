import { parse } from './parser';

describe(__filename + '#', () => {
  it('can be created', () => {
    console.log(parse('<div></div>'));
  });
});