import { parse } from './parser';
import { expect } from 'chai';
import {
  BlockExpression,
  ScriptExpression,
  DocTypeExpression,
  ElementExpression,
  CommentExpression,
  TextExpression
} from 'lang/ast/xml';


import {
  NullExpression,
  UndefinedExpression,
  BooleanExpression,
  InfinityExpression,
  NaNExpression,
  NumberExpression,
  ReferenceExpression,
  StringExpression,
  PathExpression
} from 'lang/ast/es6';

describe(__filename + '#', () => {

  describe('blocks', () => {
    it('can be created with a null expression', () => {
      const [ast] = parse('{{null}}');
      expect(ast).to.be.an.instanceof(BlockExpression);
      expect(ast.script).to.be.an.instanceof(ScriptExpression);
      expect(ast.script.value).to.be.an.instanceof(NullExpression);
    });

    it('can be created with a reference expression', () => {
      let [ast] = parse('{{a}}');
      expect(ast.script.value).to.be.an.instanceof(ReferenceExpression);

      [ast] = parse('{{a.b}}');
      expect(ast.script.value).to.be.an.instanceof(PathExpression);
      expect(ast.script.value.value[0]).to.be.an.instanceof(ReferenceExpression);
      expect(ast.script.value.value[1]).to.be.an.instanceof(StringExpression);
      expect(ast.script.value.value[1].value).to.equal('b');
    });

    it('can parse an undefined expression', () => {
      let [ast] = parse('{{undefined}}');
      expect(ast.script.value).to.be.an.instanceof(UndefinedExpression);
    });

    it('can parse NaN', () => {
      let [ast] = parse('{{NaN}}');
      expect(ast.script.value).to.be.an.instanceof(NaNExpression);
    });

    it('can parse Infinity', () => {
      let [ast] = parse('{{Infinity}}');
      expect(ast.script.value).to.be.an.instanceof(InfinityExpression);
    });

    it('can parse numbers', () => {

      [
        100,
        20.2
        // -100
      ].forEach((value) => {
        let [ast] = parse(`{{${value}}}`);
        expect(ast.script.value).to.be.an.instanceof(NumberExpression);
        expect(ast.script.value.value).to.equal(value);
      });
    });

    it('can parse booleans', () => {
      let [ast] = parse('{{true}}');
      expect(ast.script.value).to.be.an.instanceof(BooleanExpression);
      expect(ast.script.value.value).to.equal(true);

      [ast] = parse('{{false}}');
      expect(ast.script.value).to.be.an.instanceof(BooleanExpression);
      expect(ast.script.value.value).to.equal(false);
    });
  });

  describe('doctype', () => {
    it('can be parsed', () => {
      let [ast] = parse('<!DOCTYPE html>');
      expect(ast).to.be.an.instanceof(DocTypeExpression);
      expect(ast.value).to.equal('html');
    });
  });

  describe('elements', () => {
    it('can be parsed', () => {
      let [ast] = parse('<div />');
      expect(ast).to.be.an.instanceof(ElementExpression);
      expect(ast.name).to.equal('div');

      [ast] = parse('<div a />');
      expect(ast.name).to.equal('div');
      expect(ast.attributes.length).to.equal(1);
      expect(ast.attributes[0].name).to.equal('a');
      expect(ast.attributes[0].value).to.equal(void 0);


      [ast] = parse('<div a="b" />');
      expect(ast.name).to.equal('div');
      expect(ast.attributes.length).to.equal(1);
      expect(ast.attributes[0].name).to.equal('a');
      expect(ast.attributes[0].value).to.an.instanceof(StringExpression);
      expect(ast.attributes[0].value.value).to.equal('b');

      [ast] = parse('<div a="b"> </div>');
      expect(ast.name).to.equal('div');
      expect(ast.attributes.length).to.equal(1);
      expect(ast.attributes[0].name).to.equal('a');
      expect(ast.attributes[0].value).to.an.instanceof(StringExpression);
      expect(ast.attributes[0].value.value).to.equal('b');
    });

    xit('can parse a script tag', () => {
      let [ast] = parse('<script></script>');
      expect(ast).to.be.an.instanceof(ScriptExpression);
    });

    it('can parse void tags', () => {
      let [ast] = parse('<area>');
      expect(ast).to.be.an.instanceof(ElementExpression);

      [ast] = parse('<img src="source">');
      expect(ast).to.be.an.instanceof(ElementExpression);
      expect(ast.attributes[0].name).to.equal('src');
    });
  });

  describe('text', () => {
    it('can be parsed', () => {
      let [ast] = parse('hello');
      expect(ast).to.be.an.instanceof(TextExpression);
      expect(ast.value).to.equal('hello');
    });
  });


  describe('comments', () => {
    it('can be parsed', () => {
      let [ast] = parse('<!-- hello -->');
      expect(ast).to.be.an.instanceof(CommentExpression);
      expect(ast.value).to.equal('hello');
    });
  });
});
