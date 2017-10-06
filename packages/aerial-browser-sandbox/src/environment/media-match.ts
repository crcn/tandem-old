import { SEnvWindowInterface } from "./window";
import { weakMemo } from "aerial-common2";

const getMediaTextTokens = (mediaText: string) => {
  const tokens = [];
  let cursor: number = 0;

  while(cursor < mediaText.length) {
    let c = mediaText.charAt(cursor);
    const rest = mediaText.substr(cursor);

    const match = rest.match(/^([a-zA-Z0-9-]+|\(|\)|\:|\s|\t)/);

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

const translateMediaText = (mediaText: string) => {
  const tokens = getMediaTextTokens(mediaText);
  let cursor: number = 0;
  let buffer = [];

  while (cursor < tokens.length) {
    const token = tokens[cursor];
    cursor++;

    if (token === "(") {

    } else if (token === "screen") {

      // for now -- later we can do context.type === "screen"
      buffer.push("true");
    } else if (token === "min-width") {
      buffer.push("context.innerWidth", ">", `calcMeasurement("${tokens[++cursor]}"`,", context)");
    } else if (token === "max-width") {
      buffer.push("context.innerWidth", "<", `calcMeasurement("${tokens[++cursor]}"`,", context)");
    } else if (token === "min-height") {
      buffer.push("context.innerHeight", ">", `calcMeasurement("${tokens[++cursor]}"`,", context)");
    } else if (token === "max-height") {
      buffer.push("context.innerHeight", "<", `calcMeasurement("${tokens[++cursor]}"`,", context)");
    } else if (token === "and") {
      buffer.push("&&");
    } else if (token === "or") {
      buffer.push("&&");
    }
  }

  return buffer.join(" ");
};

const compileMediaText = weakMemo((mediaText: string) => new Function("context", "calcMeasurement", `return ${translateMediaText(mediaText)}`));

export const createMediaMatcher = (window: SEnvWindowInterface) => (mediaText: string) => {
  return compileMediaText(mediaText)(window, calcMeasurement);
}