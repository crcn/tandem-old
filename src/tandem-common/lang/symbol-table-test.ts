import { expect } from "chai";
import { SymbolTable, SyntheticValueObject } from "./synthetic";

describe(__filename + "#", () => {
  it("can be created", () => {
    new SymbolTable();
  });

  it("can define a value", () => {
    const table = new SymbolTable();
    table.set("a", new SyntheticValueObject("b"));
    expect(table.get("a").value).to.equal("b");
  });

  it("it can return a value from a parent", () => {
    const table = new SymbolTable();
    table.set("a", new SyntheticValueObject("b"));
    expect(table.createChild().get("a").value).to.equal("b");
  });

  it("it can set a value in a parent from a child", () => {
    const p = new SymbolTable();
    p.set("a", new SyntheticValueObject("b"));
    const c = p.createChild();
    c.set("a", new SyntheticValueObject("c"));

    expect(p.get("a").value).to.equal("c");

    p.set("a", undefined);
    c.set("a", new SyntheticValueObject("d"));
    expect(p.get("a").value).to.equal("d");
  });
});