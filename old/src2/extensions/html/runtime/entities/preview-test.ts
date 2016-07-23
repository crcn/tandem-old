import HTMLEntityPreview from './preview';
import { expect } from 'chai';
import Runtime from '../index';

describe(__filename + '#', function() {

  let runtime:Runtime;

  beforeEach(function() {
    runtime = new Runtime();
  });

  it('can be created', async function() {
    // new HTMLEntityPreview(await runtime.load('<div></div>'))
  })
});
