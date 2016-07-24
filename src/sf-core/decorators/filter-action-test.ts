import { Action } from "sf-base/actions";
import { InsertAction } from "../actions";
import filterAction from "./filter-action";
import { expect } from "chai";
import { Service } from "sf-base/services";

describe(__filename + "#", function() {
  it("can filter for actions invoked on a service method", async () => {
    class CustomService extends Service {
      @filterAction((action:InsertAction) => action.collectionName === "test")
      insert() {
        return "pong";
      }
    }

    const service = new CustomService();

    expect((await service.execute(new InsertAction("test", undefined)).read()).value).to.equal("pong");
    expect((await service.execute(new InsertAction("test2", undefined)).read()).value).to.equal(undefined);
  });
});