import { expect } from "chai";
import { cssTokenizer } from "./css";

describe(__filename + "#", function() {

  [
    ["100px", [["100", "number"], ["px", "unit"]]],
    [".5em", [[".5", "number"], ["em", "unit"]]],
    ["0.5vmin", [["0.5", "number"], ["vmin", "unit"]]],
    ["calc(  100%)", [
        ["calc", "reference"],
        ["(", "leftParen"],
        ["  ", "space"],
        ["100", "number"],
        ["%", "unit"],
        [")", "rightParen"]
      ]
    ],
    ["10px - 5px", [
      ["10", "number"],
      ["px", "unit"],
      [" ", "space"],
      ["-", "operator"],
      [" ", "space"],
      ["5", "number"],
      ["px", "unit"]
    ]],
    ["calc(100%/6)", [
      ["calc", "reference"],
      ["(", "leftParen"],
      ["100", "number"],
      ["%", "unit"],
      ["/", "operator"],
      ["6", "number"],
      [")", "rightParen"]
    ]],
    ["10em/-10", [
      ["10", "number"],
      ["em", "unit"],
      ["/", "operator"],
      ["-", "operator"],
      ["10", "number"]
    ]],
    ["2-2", [
      ["2", "number"],
      ["-", "operator"],
      ["2", "number"]
    ]],
    ["10deg", [
      ["10", "degree"]
    ]],
    ["linear-gradient(to top, blue 50%, red)", [
      ["linear-gradient", "reference"],
      ["(", "leftParen"],
      ["to", "reference"],
      [" ", "space"],
      ["top", "reference"],
      [",", "comma"],
      [" ", "space"],
      ["blue", "reference"],
      [" ", "space"],
      ["50", "number"],
      ["%", "unit"],
      [",", "comma"],
      [" ", "space"],
      ["red", "reference"],
      [")", "rightParen"]
    ]]
  ].forEach(function([source, matches]) {
    it("can tokenize " + source, function() {
      const tokens = cssTokenizer.tokenize(source).map(function(token) {
        return [token.value, token.type];
      });

      expect(tokens).to.eql(matches);
    });
  });
});
