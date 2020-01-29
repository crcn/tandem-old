import { expect } from "chai";
import { Engine } from "../engine";
import * as fs from "fs";

describe(__filename + "#", () => {
  [
    [
      {
        "entry.pc": `Hello World`
      },
      {},
      `Hello World`
    ]
  ].forEach(([graph, context, expectedHTML]) => {
    it(`can render "${JSON.stringify(graph)}"`, () => {
      const engine = new Engine();
    });
  });
});
