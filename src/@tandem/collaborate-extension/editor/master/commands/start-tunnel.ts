import { BaseCollaborateExtensionCommand } from "./base";
import { } from "@tandem/editor/master/config";
import { GetTunnelUrlRequest } from "@tandem/editor/common";

export class StartTunnelCommand extends BaseCollaborateExtensionCommand {
  async execute() {
    // TODO
    this.logger.info(`starting http tunnel on port ${this.config.server.port}`);

    return { url: await GetTunnelUrlRequest.dispatch(this.bus) };
  }
}