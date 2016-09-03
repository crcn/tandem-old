import { Logger } from "../logger";
import { NoopBus } from "mesh";
import { IInvoker } from "sf-common/actors";

const noopBus = new NoopBus();

export default function () {
  return (clazz: { new(...args): IInvoker }) => {
    Object.defineProperty(clazz.prototype, "logger", {
      get() {
        return this._logger || (this._logger = new Logger(
          this.bus || noopBus,
          `${this.constructor.name}: `
        ));
      }
    });
  };
}
