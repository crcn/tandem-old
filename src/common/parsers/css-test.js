import CSSParser from './css';
import expect from 'expect.js';

describe(__filename + '#', function () {
  it('can parse functions', function () {
    var ast = CSSParser.parse('linear-gradient(0deg, blue, red)');
    expect(ast.type).to.be('call');
    expect(ast.name).to.be('linear-gradient');
    expect(ast.params[0].type).to.be('degree');
    expect(ast.params[0].value).to.be('0');
    expect(ast.params[2].path[0]).to.be('red');
  });


  it('can parse functions in functions', function () {
    var ast = CSSParser.parse('linear-gradient(0deg, rgba(0,0,0,0.1), blue)');
    expect(ast.type).to.be('call');
    expect(ast.name).to.be('linear-gradient');
    expect(ast.params.length).to.be(3);
    expect(ast.params[1].type).to.be('call');
    expect(ast.params[2].type).to.be('reference');
    expect(ast.params[2].path[0]).to.be('blue');
  });

  it('can parse lists', function () {
    var ast = CSSParser.parse('a, b, c');
    expect(ast.length).to.be(3);
    expect(ast[0].path[0]).to.be('a');
    expect(ast[1].path[0]).to.be('b');
    expect(ast[2].path[0]).to.be('c');
  });

  it('can parse a list of spaces', function () {
    var ast = CSSParser.parse('a  b c');
    expect(ast.length).to.be(3);
    expect(ast[0].path[0]).to.be('a');
    expect(ast[1].path[0]).to.be('b');
    expect(ast[2].path[0]).to.be('c');
  });

  it('can parse a function call with spaced params', function () {
    var ast = CSSParser.parse('linear-gradient(top left right, blue, red)');

    expect(ast.params.length).to.be(3);
    expect(ast.params[0].length).to.be(3);
    expect(ast.params[0][0].type).to.be('reference');
  });

  it('can parse a list of functions', function () {
    var ast = CSSParser.parse('linear-gradient(top right, blue, red), linear-gradient(10deg, blue 50%, rgb(0,0,0,0.1))');

    expect(ast.length).to.be(2);
    expect(ast[1].name).to.be('linear-gradient');
    expect(ast[1].params.length).to.be(3);
    expect(ast[1].params[2].params.length).to.be(4);
  });

  it('can parse colors', function () {
    var ast = CSSParser.parse('#FF6600');
    expect(ast.type).to.be('color');
    expect(ast.value).to.be('#FF6600');
  });

  it('can parse negative lengths', function () {
    var ast = CSSParser.parse('-10px');
    expect(ast.type).to.be('neg');
  });

  it('can parse - without busting', function () {
    var ast = CSSParser.parse('-');
  });

  it('parses double negs', function () {
    var ast = CSSParser.parse('--1');
    expect(ast.type).to.be('neg');
    expect(ast.value.type).to.be('neg');
  });
});
