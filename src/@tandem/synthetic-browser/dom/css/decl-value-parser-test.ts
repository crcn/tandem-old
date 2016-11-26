import { expect } from "chai";
import { parseCSSDeclValue, DeclValueExpressionKind } from "./index";

describe(__filename + "#", () => {
  it("Can parse an identifier", () => {
    expect(parseCSSDeclValue("absolute").kind).to.equal(DeclValueExpressionKind.IDENTIFIER);
    expect(parseCSSDeclValue("underline").kind).to.equal(DeclValueExpressionKind.IDENTIFIER);
    expect(parseCSSDeclValue("a-b-c").kind).to.equal(DeclValueExpressionKind.IDENTIFIER);    
    expect(parseCSSDeclValue("a-b-c").toString()).to.equal("a-b-c");    
  });

  it("Can parse numbers", () => {    
    expect(parseCSSDeclValue("10").kind).to.equal(DeclValueExpressionKind.NUMBER);
    expect(parseCSSDeclValue("-10").kind).to.equal(DeclValueExpressionKind.NUMBER);
    expect(parseCSSDeclValue("-10.5").kind).to.equal(DeclValueExpressionKind.NUMBER);
    expect(parseCSSDeclValue("10.5").kind).to.equal(DeclValueExpressionKind.NUMBER);
    expect(parseCSSDeclValue(".5").kind).to.equal(DeclValueExpressionKind.NUMBER);
  });

  it("Can parse comma lists", () => {    
    expect(parseCSSDeclValue("a, b, c").kind).to.equal(DeclValueExpressionKind.COMMA_LIST);
  });

  it("Can parse space lists", () => {    
    expect(parseCSSDeclValue("a b c").kind).to.equal(DeclValueExpressionKind.SPACE_LIST);
  });

  it("Can parse measurements", () => {    
    expect(parseCSSDeclValue("10px").kind).to.equal(DeclValueExpressionKind.MEASUREMENT);
    expect(parseCSSDeclValue("10.5px").kind).to.equal(DeclValueExpressionKind.MEASUREMENT);
    expect(parseCSSDeclValue("0.05em").kind).to.equal(DeclValueExpressionKind.MEASUREMENT);
  });

  it("Can parse degrees", () => {    
    expect(parseCSSDeclValue("10deg").kind).to.equal(DeclValueExpressionKind.DEGREE);
  });

  it("Can parse colors", () => {    
    expect(parseCSSDeclValue("#F60").kind).to.equal(DeclValueExpressionKind.COLOR);
    expect(parseCSSDeclValue("#FF6600").kind).to.equal(DeclValueExpressionKind.COLOR);
  });

  it("Can parse calls", () => {    
    expect(parseCSSDeclValue("rgba(0,0,0,0.5)").kind).to.equal(DeclValueExpressionKind.CALL);
    expect(parseCSSDeclValue("linear-gradient(rgba(0,0,0,0))").kind).to.equal(DeclValueExpressionKind.CALL);
  });

  it("Can parse strings", () => {    
    expect(parseCSSDeclValue('"Helvetica"').kind).to.equal(DeclValueExpressionKind.STRING);
  });
});