import { Injector } from "@tandem/common";
import {
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMContainer,
  SyntheticDOMElement,
  SyntheticDOMText,
  parseCSS,
  evaluateCSS,
  SyntheticDOMComment,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";
import { createSandboxProviders, IFileResolver, IFileSystem } from "@tandem/sandbox";
import { createCoreApplicationProviders } from "@tandem/core";
import { sample, sampleSize, random } from "lodash";

export function createMockBrowser() {
  const deps = createSandboxProviders();
  return new SyntheticBrowser(new Injector(deps));
}

const CHARS = "abcdefg".split("");


function generateRandomText(maxLength: number = 5) {
  return sampleSize(CHARS, random(1, maxLength)).join("");
}

function generateRandomChar() {
  return sample(CHARS);
}

export function generateRandomSyntheticHTMLElement(document: SyntheticDocument, maxChildCount: number = 10, maxDepth: number = 10, maxAttributes: number = 10, generateShadow: boolean = false) {

  function createRandomSyntheticFragment() {

    const fragment = document.createDocumentFragment();
    if (!maxDepth) return fragment;

    for (let i = random(0, maxChildCount); i--;) {
      fragment.appendChild(generateRandomSyntheticHTMLElement(document, maxChildCount, random(0, maxDepth - 1), maxAttributes, generateShadow));
    }

    return fragment;
  }


  function createRandomElement() {
    const element = document.createElement(generateRandomChar());
    for (let i = random(0, maxAttributes); i--;) {
      element.setAttribute(
        generateRandomChar(),
        generateRandomText()
      );
    }
    element.appendChild(createRandomSyntheticFragment());

    if (generateShadow && Math.random() > 0.5) {
      element.$setShadowRoot(createRandomSyntheticFragment());
    }

    return element;
  }

  function createRandomTextNode() {
    return document.createTextNode(generateRandomText());
  }

  function createRandomComment() {
      return document.createComment(generateRandomText());
  }

  return maxDepth ? createRandomElement() : sample([createRandomElement, createRandomTextNode, createRandomComment])();
}

export function generateRandomStyleSheet(maxRules: number = 100, maxDeclarations: number = 20): SyntheticCSSStyleSheet {

  function createKeyFrameRule() {
    `@keyframes ${generateRandomChar()} {
      ${
        Array.from({ length: random(0, maxRules) }).map((v) => {
          return createStyleRule();
        }).join("\n")
      }
    }`
  }
  function createStyleRule() {
    return `.${generateRandomChar()} {
      ${
        Array.from({ length: random(0, maxDeclarations) }).map((v) => {
          return `${generateRandomChar()}: ${generateRandomText(2)};`;
        }).join("\n")
      }
    }`
  }
  function createMediaRule() {
    return `@media ${generateRandomChar()} {
      ${
        Array.from({ length: random(0, maxRules) }).map((v) => {
          return sample([createStyleRule, createKeyFrameRule])();
        }).join("\n")
      }
    }`;
  }

  const randomStyleSheet = Array
  .from({ length: random(0, maxRules) })
  .map(v => sample([createStyleRule])()).join("\n");

  return evaluateCSS(parseCSS(randomStyleSheet));
}