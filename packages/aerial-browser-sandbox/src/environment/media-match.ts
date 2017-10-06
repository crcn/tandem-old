import { SEnvWindowInterface } from "./window";
import { weakMemo } from "aerial-common2";

const getMediaTextTokens = (mediaText: string) => {
  const tokens = [];
  let cursor: number = 0;

  while(cursor < mediaText.length) {
    let c = mediaText.charAt(cursor);
    const rest = mediaText.substr(cursor);

    const match = rest.match(/^([a-zA-Z0-9-]+|\(|\)|\:|\s|\t|\,|\/|\+|\-)/);

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

const getMediaJSExpression = (cursor, tokens: string[], until?: string) => {
  const buffer = [];
  while (cursor < tokens.length) {
    const token = tokens[cursor];
    if (token === until) {
      break;
    }
    cursor++;

    if (token === "(" || token === ")") {
    } else if (token === "screen") {

      // for now -- later we can do context.type === "screen"
      buffer.push("true");
    } else if (token === "min-width") {
      const chunk = getMediaJSExpression(cursor, tokens, ")");
      cursor += chunk.length;
      console.log(tokens.slice(cursor));
      buffer.push("context.innerWidth", ">", `calcMeasurement("${chunk}"`,", context)");
    } else if (token === "max-width") {
      const chunk = getMediaJSExpression(cursor, tokens, ")");
      cursor += chunk.length;
      buffer.push("context.innerWidth", "<", `calcMeasurement("${chunk}"`,", context)");
    } else if (token === "min-height") {
      const chunk = getMediaJSExpression(cursor, tokens, ")");
      cursor += chunk.length;
      buffer.push("context.innerHeight", ">", `calcMeasurement("${chunk}"`,", context)");
    } else if (token === "max-height") {
      const chunk = getMediaJSExpression(cursor, tokens, ")");
      cursor += chunk.length;
      buffer.push("context.innerHeight", "<", `calcMeasurement("${chunk}"`,", context)");
    } else if (token === "and") {
      buffer.push("&&");
    } else if (token === "or" || token === ",") {
      buffer.push("&&");
    } else {
      buffer.push(token);
    }
  }

  return buffer.join(" ");
}

const translateMediaText = (mediaText: string) => {
  console.log(mediaText, getMediaJSExpression(0, getMediaTextTokens(mediaText)));
  return getMediaJSExpression(0, getMediaTextTokens(mediaText));
};

const compileMediaText = weakMemo((mediaText: string) => new Function("context", "calcMeasurement", `return ${translateMediaText(mediaText)}`));

export const createMediaMatcher = (window: SEnvWindowInterface) => (mediaText: string) => {
  return compileMediaText(mediaText)(window, calcMeasurement);
}