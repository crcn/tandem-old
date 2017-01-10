import { getMessagetClientId } from "@tandem/mesh";
import { SetMousePositionRequest } from "../messages";
import { IOClientDisconnectedMessage } from "@tandem/editor/common";
import { BaseCollaborateExtensionCommand } from "./base";

export class RemoveCollaboratorCommand extends BaseCollaborateExtensionCommand {
  execute(message: IOClientDisconnectedMessage) {
    this.collaboratorStore.removeCollaborator(getMessagetClientId(message));
  }
}