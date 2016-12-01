import { Status } from "@tandem/common"
import { IMessage } from "@tandem/mesh";
import { BaseEditorBrowserCommand } from "./base";

/**
 * Called once after the app has initialized
 */

export class SetReadyStatusCommand extends BaseEditorBrowserCommand {
  execute(message: IMessage) {
    this.store.status = new Status(Status.COMPLETED);
  }
}