import { expect } from "chai";
import { SymbolTable } from "./symbol-table";


describe(__filename + "#", () => {
  it("can be created", () => {
    new SymbolTable();
  });

  it("can define a value", () => {
    const table = new SymbolTable();
    table.set("a", "b");
    expect(table.get("a")).to.equal("b");
  });

  it("it can return a value from a parent", () => {
    const table = new SymbolTable();
    table.set("a", "b");
    expect(table.createChild().get("a")).to.equal("b");
  });

  it("it can set a value in a parent from a child", () => {
    const p = new SymbolTable();
    p.set("a", "b");
    const c = p.createChild();
    c.set("a", "c");

    expect(p.get("a")).to.equal("c");

    p.set("a", undefined);
    c.set("a", "d");
    expect(p.get("a")).to.equal("d");
  });
});