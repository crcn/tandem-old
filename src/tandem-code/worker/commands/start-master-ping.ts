import { BaseCommand } from "@tandem/common";
import { readOneChunk } from "@tandem/mesh";
import { PingRequest } from "tandem-code/common/messages";

const PING_TIMEOUT = 1000 * 10;

/**
 * ensures that the worker doesn't turn into a zombie after master closes.
 */

export class StartMasterPingCommand extends BaseCommand {
  execute() {
    const ping = async () => {
      this.logger.debug("Pinging master");
      const value = (await readOneChunk(this.bus.dispatch(new PingRequest()))).value;
      if (value !== true) {
        this.logger.warn(`Master didn't return a ping -- closing server`);
        process.exit(1);
      }

      setTimeout(ping, PING_TIMEOUT);
    }

    ping();
  }
}