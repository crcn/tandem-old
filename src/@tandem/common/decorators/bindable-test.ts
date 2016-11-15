import { bindable } from "./bindable";
import { expect } from "chai";
import { Action } from "../actions";
import { Observable } from "../observable";

describe(__filename + "#", () => {
  it("can make a property bindable for changes", () => {
    class Item extends Observable {
      @bindable()
      public name: string;
    }

    const item = new Item();
    let lastAction: Action;
    item.observe({
      dispatch: action => lastAction = action
    });

    item.name = "john";
    expect(lastAction.type).to.equal("propertyChange");

  });
});