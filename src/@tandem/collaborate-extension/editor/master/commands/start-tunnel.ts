import { BaseCollaborateExtensionCommand } from "./base";
import { } from "@tandem/editor/master/config";

export class StartTunnelCommand extends BaseCollaborateExtensionCommand {
  execute() {
    // TODO
    this.logger.info(`starting http tunnel on port ${this.config.server.port}`);

    const port = this.config.server.port;
    const protocol = "http:";
    const hostname = "localhost";

    const tunnelHost = `${protocol}//${hostname}:${port}`;

    return { url: tunnelHost };
  }
}