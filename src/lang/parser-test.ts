declare var __filename;

import parser from './parser';
import { expect } from 'chai';

describe(__filename + '#', function() {
  var sources = [
    '<div></div>',
    '<img>',
    '<div />',
    '<div a="b" />',
    '<div a="b" c="d" />',
    '<div a b="c" d />',
    '<div a="b" c />',
    '<div a b c />',
    '<div>text</div>',
    '<div>text <!--comment--></div>',
    '<div></div><div />',
    '<div>{{a}}</div>'
  ];

  sources.forEach(function(source) {
    it(`can parse ${source}`, function() {
      var ast = parser.parse(source);
    });
  });
}); 