import { expect } from 'chai';
import { parse } from './xml.peg';

describe(__filename + '#', function() {
  [
    // elements
    '<div></div>',
    '<div />',
    '<div a="b"></div>',
    '<div a b></div>',
    '<div a b />',

    // text
    'hello',
    
    // comment
    '<!--comment-->',

    // blocks
    '{{a}}',
    '{{a.b}}',
    '{{"a"}}',
    '{{\'a\'}}',
    "{{a.b(c)}}",
    "{{a+b}}",
    "{{1}}",
    "{{1+2}}",
    "{{a/2}}",
    "{{-1}}",
    "{{!1}}",
    "{{a?b:c}}",
    "{{(a+b)-1}}",
    "{{{a:b,c:d}}}"
  ].forEach(source => {
    it(`can parse ${source}`, () => {
      parse(source);
    });
  });
});