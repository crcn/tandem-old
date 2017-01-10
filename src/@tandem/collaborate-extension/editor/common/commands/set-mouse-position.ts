import { BaseCollaborateExtensionCommand } from "./base";
import { getMessagetClientId } from "@tandem/mesh";
import { SetMousePositionRequest } from "../messages";

export class SetMousePositionCommand extends BaseCollaborateExtensionCommand {
  execute(message: SetMousePositionRequest) {

    const clientId = getMessagetClientId(message);
    if (!clientId) return;
    
    this.collaboratorStore.getCollaborator(clientId).mousePosition = message.position;
  }
}