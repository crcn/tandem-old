import { Dependencies } from "sf-core/dependencies";
import { Runtime } from "./runtime";
import { expect } from "chai";
import { parse } from "./test/parser.peg";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Runtime(new Dependencies());
  });

  it("can load an expression", async () => {
    const runtime = new Runtime(new Dependencies());
    await runtime.load(parse('var a = 5;'));
  });
});
