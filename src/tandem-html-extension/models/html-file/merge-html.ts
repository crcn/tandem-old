
import StringScanner from "tandem-common/string/scanner";
import { Diff, applyPatch } from "diff";

const htmlDiff = new Diff();
htmlDiff.tokenize = (value) => {
  const scanner = new StringScanner(value);
  const tokens = [];
  let i = 0;
  function addToken(search) {
    if (scanner.scan(search)) {
      tokens.push(scanner.getCapture());
      return true;
    }
    return false;
  }

  while (!scanner.hasTerminated() && i++ < 1000) {

    // whitespace
    if (addToken(/^[\s\r\n\t]+/)) continue;

    // whole words
    if (addToken(/^[\w0-9-]+/)) continue;

    // everything else
    if (addToken(/^./)) continue;
  }

  return tokens;
};

export default (oldStr, newStr) => {
  const changes = htmlDiff.diff(oldStr, newStr);
  let output = "";

  for (const { value, removed } of changes) {


    // do not remove ws
    if (removed && !/^[\s\r\n\t]+$/.test(value)) {
      continue;
    }

    output += value;
  }

  return output;
};
