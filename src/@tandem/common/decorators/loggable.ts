import { Logger } from "../logger";
import { NoopBus } from "mesh";
import { IInvoker } from "@tandem/common/actors";

const noopBus = new NoopBus();

export function loggable () {
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
