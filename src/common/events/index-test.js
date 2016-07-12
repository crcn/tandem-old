import { Event } from './index';
import expect from 'expect.js';

describe(__filename + '#', function () {
  it('can be created', function () {
    Event.create('a');
  });
});
