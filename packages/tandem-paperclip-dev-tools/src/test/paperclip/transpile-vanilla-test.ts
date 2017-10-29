import { 
  transpilePCASTToVanillaJS
} from "../../paperclip";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can transpile a text node", () => {
    const newSource = transpilePCASTToVanillaJS(`a`, "abc");
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
      
    `,
    `
    <meta name="name" content="Gutter" />
    
    <template name="gutter" export>
      {{children}}
    </template>
    
    <template name="preview" export dev>
      <gutter>
        Gutter me this
      </gutter>
    </template>
    `,
    `
      <style>
          .container {

          }
      </style>
    `,
    `
      <style scoped>
          .container {

          }
      </style>
    `,
    `
      <style>
          .container {
            color: red;
          }

          @keyframes a {
            0% {
              color: red;
            }
          }

          @media screen {
            .container {
              color: red;
              font-size: 5;
            }
            .content {
              color: blue;
            }
          }
      </style>
    `
  ].forEach((source) => {
    it(`can transpile ${source} to vanilla JS`, () => {
      const result = transpilePCASTToVanillaJS(source, "abc");
      // console.log(result);
    });
  });
});