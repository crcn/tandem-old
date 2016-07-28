import { Service } from "./base";
import { IApplication } from "sf-core/application";
import { IActor, IInvoker } from "sf-core/actors/index";

export { Service };

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker {
  constructor(readonly app: T) {
    super();
  }

  get bus(): IActor {
    return this.app.bus;
  }
};