import {BaseCollaborateExtensionBrowserCommand } from "./base";

export class SyncSelectedCommand extends BaseCollaborateExtensionBrowserCommand {
  execute() {
    this.logger.debug("Syncing selected items");
  }
}