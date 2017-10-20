import { 
  transpilePCASTToVanillaJS
} from "../../paperclip";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can transpile a text node", () => {
    const newSource = transpilePCASTToVanillaJS(`a`);
  });

  // smoke
  [
    `a`,
    `a {{b}}`,
    `<span />`,
    `<span a="b" />`,
    `<span a />`,
    `<span>ab</span>`,
    `<span><h1>ab</h1></span>`,
    `<template name="test" export>a</template>`,
    `
      <template name="test">
        <h1 style={{style}}>Header</h1>
      </template>
      <test style="color: red;" />
    `,
    `
      <template name="default" export>
        <h1 style={{style}}>Header</h1>
      </template>
      <test style="color: red;" />
    `,
    `
      <template name="test">
        <span>
          {{children}}
        </span>
      </template>
      <test>
        <h1>a</h1>
        <h1>b</h1>
        <h1>c</h1>
      </test>
    `,
    `
      <div name="test" export default />
    `,
    `
      <span>
        <style scoped>
          h1 {
            color: red;
          }
        </style>
        <h1>a</h1>
      </span>
      <h1>a</h1>
      
    `
  ].forEach((source) => {
    it(`can transpile ${source} to vanilla JS`, () => {
      const result = transpilePCASTToVanillaJS(source);
      console.log(result);
    });
  });
});