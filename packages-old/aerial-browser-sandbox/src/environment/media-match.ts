import { SEnvWindowInterface } from "./window";
import { weakMemo } from "aerial-common2";

const getMediaTextTokens = (mediaText: string) => {
  const tokens = [];
  let cursor: number = 0;

  while(cursor < mediaText.length) {
    let c = mediaText.charAt(cursor);
    const rest = mediaText.substr(cursor);

    const match = rest.match(/^([a-zA-Z0-9-\.\-\\]+|\(|\)|\:|\s|\t|\,|\/|\+|\-)/);

    if (!match) {
      throw new Error(`Syntax error, unexpected token ${c} in ${mediaText}.`);
    }

    // do not add ws chars
    if (!/^[\s\t]+$/.test(match[1])) {
      tokens.push(match[1]);
    }

    cursor += match[1].length;
  }

  return tokens;
}

// only support pixels for now
const calcMeasurement = (value: string, window: SEnvWindowInterface) => value.replace("px", "");

const MEDIA_PROP_CONVERSION = {
  "min-width": ["getWidth(context)", ">"],
  "max-width": ["getWidth(context)", "<"],
  "min-height": ["getHeight(context)", ">"],
  "max-height": ["getHeight(context)", "<"],

  "-webkit-min-device-pixel-ratio": ["false", "&&"],
  "min--moz-device-pixel-ratio": ["false", "&&"],
  "-o-min-device-pixel-ratio": ["false", "&&"],
  "min-device-pixel-ratio": ["false", "&&"],
  "min-resolution": ["false", "&&"]
};

const getMediaJSExpression = (cursor, tokens: string[], until?: string) => {
  const buffer = [];
  while (cursor < tokens.length) {
    const token = tokens[cursor];
    if (token === until) {
      break;
    }
    cursor++;

    // eat these
    if (/^(only|\(\))$/.test(token)) {
      continue;
    }

    // unsupported media types for now
    if (/^(print)$/.test(token)) {
      buffer.push("false");
    } else if (token === "screen") {

      // for now -- later we can do context.type === "screen"
      buffer.push("true");
    } else if (MEDIA_PROP_CONVERSION[token]) {
      const chunk = getMediaJSExpression(++cursor, tokens, ")");
      cursor += chunk.length;
      buffer.push(...MEDIA_PROP_CONVERSION[token], `calcMeasurement("${chunk.join(" ")}"`,", context)");
    } else if (token === "and") {
      buffer.push("&&");
    } else if (token === "or" || token === ",") {
      buffer.push("&&");
    } else {
      buffer.push(token);
    }
  }

  return buffer;
}

const translateMediaText = (mediaText: string) => {
  return getMediaJSExpression(0, getMediaTextTokens(mediaText)).join(" ");
};

const compileMediaText = weakMemo((mediaText: string) => new Function("context", "calcMeasurement", "getWidth", "getHeight", `return ${translateMediaText(mediaText)}`));

const getWidth = ({ bounds }) => bounds.right - bounds.length;
const getHeight = ({ bounds }) => bounds.bottom - bounds.top;

export const createMediaMatcher = (window: SEnvWindowInterface) => (mediaText: string) => {
  return compileMediaText(mediaText)(window, getWidth, getHeight, calcMeasurement);
}