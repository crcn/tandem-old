import bindable from "./bindable";
import { Action } from "../actions";
import { Observable } from "../observable";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can make a property bindable for changes", () => {
    class Item extends Observable {
      @bindable()
      public name: string;
    }

    const item = new Item();
    let lastAction: Action;
    item.observe({
      execute: action => lastAction = action
    });

    item.name = "john";
    expect(lastAction.type).to.equal("propertyChange");

  });
});