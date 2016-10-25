import { Action } from "@tandem/common/actions";
import { expect } from "chai";
import { Service } from "@tandem/common/services";
import { filterAction } from "./filter-action";
import { DSInsertAction } from "../actions";

describe(__filename + "#", () => {
  it("can filter for actions invoked on a service method", async () => {
    class CustomService extends Service {
      @filterAction((action: DSInsertAction<any>) => action.collectionName === "test")
      dsInsert() {
        return "pong";
      }
    }

    const service = new CustomService();

    expect((await service.execute(new DSInsertAction("test", undefined)).read()).value).to.equal("pong");
    expect((await service.execute(new DSInsertAction("test2", undefined)).read()).value).to.equal(undefined);
  });
});