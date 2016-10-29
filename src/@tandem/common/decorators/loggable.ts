import { inject } from "@tandem/common/decorators";
import { Logger } from "../logger";
import { NoopBus } from "mesh";
import { IInvoker } from "@tandem/common/actors";
import { PrivateBusDependency } from "@tandem/common/dependencies";

const noopBus = new NoopBus();

// TODO - use a singleton here? It might be okay
export function loggable () {
  return (clazz: any) => {

    const loggerBusProperty = "$$loggerBus";

    // this assumes the object is being injected -- it may not be.
    inject(PrivateBusDependency.ID)(clazz.prototype, loggerBusProperty);

    Object.defineProperty(clazz.prototype, "logger", {
      get() {
        if (this.$$logger) return this.$$logger;

        const bus = this[loggerBusProperty];

        // create a child logger so that the prefix here does
        // not get overwritten
        return this.$$logger = (new Logger(
          bus || noopBus,
          `${this.constructor.name}: `
        ).createChild());
      }
    });
  };
}

// export function logCall() {

// }
