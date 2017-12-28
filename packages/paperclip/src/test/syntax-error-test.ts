import { expect } from "chai";
import { parseModuleSource } from "..";

describe(__filename + "#", () => {

  // smoke
  [
    [`<>`, [[0, 1, `Missing open tag name.`]]],
    [`<a`, [[1, 2, `Unexpected end of file.`]]],
    [`<a `, [[2, 3, `Unexpected end of file.`]]],
    [`<a<`, [[0, 1, `Tag name contains a character where " " or > is expected.`]]],
    [`<a a""`, [[4, 5, `Unexpected token.`]]],
    [`<a a`, [[3, 4, `Unexpected end of file.`]]],
    [`<a a `, [[4, 5, `Unexpected end of file.`]]],
    [`<a a=`, [[4, 5, `Unexpected end of file.`]]],
    [`<a a=""`, [[6, 7, `Unexpected end of file.`]]],
    [`<a a="">`, [[0, 8, `Close tag is missing.`]]],
    [`<a></a>`, []],
    [`<a a=""><`, [[8, 9, `Missing open tag name.`]]],
    [`<a a=""></`, [[8, 10, `Missing close tag name.`]]],
    [`<a a="></`, [[5, 6, `Missing closing " character.`]]],
    [`<a a='></`, [[5, 6, `Missing closing ' character.`]]],
    [`<a a=""></a`, [[8, 11, `Missing > character.`]]],
    [`[[abcde`, [[2, 7, `Unexpected block type abcde.`]]],
    [`[[bind`, [[2, 6, `Unexpected end of file.`]]],
    [`[[bind  `, [[2, 8, `Unexpected end of file.`]]],
    [`[[bind test`, [[0, 11, `Unexpected end of file.`]]],
    [`[[bind test]`, [[0, 1, `Missing closing ] character.`]]],
    [`[[bind test]]`, []],
    [`[[if test]]`, [[2, 4, `Condition blocks can only be added to elements, for example: <div [[if condition]]></div>.`]]],
    [`[[elseif test]]`, [[2, 8, `Condition blocks can only be added to elements, for example: <div [[if condition]]></div>.`]]],
    [`[[else test]]`, [[2, 6, `Condition blocks can only be added to elements, for example: <div [[if condition]]></div>.`]]],
    [`[[repeat items]]`, [[2, 8, `Repeat blocks can only be added to elements, for example: <div [[repeat items in item, i]]></div>.`]]],
    [`<a b="[[if a]]"></a>`, [[8, 10, `Condition blocks cannot be assigned to attributes.`]]],
    [`<a b="[[repeat a]]"></a>`, [[8, 14, `Repeat blocks cannot be assigned to attributes.`]]],
    [`<a [[repeat]]></a>`, [[11, 12, `Unexpected token.`], [5, 11, `Unexpected token.`]]],
    [`<a [[repeat a]]></a>`, [[5, 13, `Unexpected token.`]]],
    [`<a [[repeat items ,]]></a>`, [[5, 18, `Unexpected token.`]]],
    [`<a [[repeat items`, [[5, 17, `Unexpected end of file.`]]],
    [`<a [[repeat items as]]></a>`, [[5, 20, `Unexpected token.`]]],
    [`<a [[repeat items as item]]></a>`, []],
    [`<a [[repeat items as items,]]></a>`, [[5, 27, `Unexpected token. Repeat index parameter should only contain characters a-zA-Z.`]]],
    [`<a b="""`, [[7, 8, `Unexpected token.`]]],
    [`<a b=[[bind a +]] />`, [[7, 15, `Unexpected token.`]]],
    [`<a b=[[bind "a]] />`, [[12, 13, `Missing closing " character.`]]],
    [`<a b=[[bind {a: 1]] />`, [[7, 17, `Unexpected token.`]]],
    [`<a b=[[bind {a: 1 }]] />`, []],
    [`<a b=[[bind {a b}]] />`, [[7, 15, `Missing : for object.`]]],
    [`<a b=[[bind a.b.0]] />`, [[5, 15, `Unexpected token.`]]],
    [`<a b=[[bind [a b]]] />`, [[12, 15, `Unexpected token.`]]],
    [`<a b=[[bind {a: [1}]] />`, [[16, 18, `Unexpected token.`]]],
    [`<style> .container {}`, [[20, 21, `Unexpected end of file.`]]],
    [`<style> .container {} </style>`, []],
    [`<style> .container {} </style`, [[22, 29, `Missing > character.`]]],
    [`<style> .container { color } </style>`, [[21, 26, `Unexpected token.`]]],
    [`<style> .container { color: } </style>`, [[21, 26, `Missing declaration value`]]],
    [`<style> .container { color:; } </style>`, [[21, 26, `Unexpected token.`]]],
    [`<style> a </style>`, [[10, 12, `Unexpected token.`]]],
    [`<style> a { </style>`, [[12, 14, `Unexpected token.`]]],
    [`<style> . </style>`, [[10, 12, `Unexpected token.`]]]
  ].forEach(([input, expectedDiagnostics]: [string, any[]]) => {
    it(`Generates a syntax error for "${input}"`, () => {
      expect(parseModuleSource(input).diagnostics.map((({location, message}) => [location.start.pos, location.end.pos, message]))).to.eql(expectedDiagnostics);
    });
  });
});