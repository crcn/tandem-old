import TextRuler from "./text-ruler";
import { expect } from "chai";
import encode from "./encode";

describe(__filename + "#", function() {

  if (typeof window === "undefined") {
    return;
  }

  it("can be created", function() {
    new TextRuler({});
  });

  [
    ["abc"],
    ["M437•"],
    ["\s\t\s\tabc"]
  ].forEach(function([text, width]) {
    xit("can calculate the size of " + text, function() {
      let style = { fontSize: "14px" };

      const tr = new TextRuler({
        style: style
      });

      const span = document.createElement("span");
      Object.assign(span.style, style);
      span.innerHTML = encode(text);
      document.body.appendChild(span);
      style = window.getComputedStyle(span);
      expect(tr.calculateSize(text)[0]).to.equal(span.offsetWidth);
      document.body.removeChild(span);
    });
  });

  [
    ["abc", Infinity, 3],
    ["abc", 3, 0],
    ["abc", 4, 1],
    ["abc", 14, 2],
    ["a\t\s12", 7, 1]
  ].forEach(function([text, point, position]) {
    it("converts " + point + " point in " + text + " to " + position + " position", function() {
      const tr = new TextRuler({});
      expect(tr.convertPointToCharacterPosition(text, point)).to.equal(position);
    });
  });
});
