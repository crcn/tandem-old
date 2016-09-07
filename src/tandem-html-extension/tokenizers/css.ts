import { Token, StringScanner } from "tandem-common";

// linear-gradient(45deg, blue, red)
// linear-gradient(to left top, blue, red);
// linear-gradient(0deg, blue, green 40%, red);
import { TokenTypes } from "tandem-common";

export namespace CSSTokenTypes {
  export const COLOR = "color";
  export const REFERENCE = "reference";
}

const tokenMap = {
  ".": TokenTypes.DOT,
  ":": TokenTypes.COLON,
  "(": TokenTypes.LEFT_PAREN,
  ")": TokenTypes.RIGHT_PAREN,
  ",": TokenTypes.COMMA,
  "white": CSSTokenTypes.COLOR
};


export class CSSTokenizer {
  tokenize(source) {
    const scanner = new StringScanner(source);
    const tokens = [];

    function addToken(search, type) {
      if (scanner.scan(search)) {
        tokens.push(new Token(scanner.getCapture(), type));
        return true;
      }
      return false;
    }

    // function addOperator() {
    //   return addToken(/^[\/\*\-\+]/, OPERATOR);
    // }

    while (!scanner.hasTerminated()) {

      const num = scanner.scan(/^((\.\d+)|(\d)+(\.\d+)?)/);

      if (num) {
        if (scanner.scan(/^deg/)) {
          tokens.push(new Token(num, "degree"));
        } else {
          tokens.push(new Token(num, "number"));
          // http://www.w3schools.com/cssref/css_units.asp
          addToken(/^(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/, "unit");
        }
        continue;
      }

      if (addToken(/^\#\w{1,6}/, CSSTokenTypes.COLOR)) continue;
      if (addToken(/^\w+(\-\w+)?/, CSSTokenTypes.REFERENCE)) continue;
      if (addToken(/^\u0020+/, TokenTypes.SPACE)) continue;
      if (addToken(/^\t+/, TokenTypes.TAB)) continue;
      if (addToken(/^[\/\*\-\+]/, TokenTypes.OPERATOR)) continue;
      if (addToken(/^,/, TokenTypes.COMMA)) continue;

      const char = scanner.nextChar();

      tokens.push(new Token(char, tokenMap[char] || "text"));
    }

    return tokens;
  }
}

export const cssTokenizer = new CSSTokenizer();
