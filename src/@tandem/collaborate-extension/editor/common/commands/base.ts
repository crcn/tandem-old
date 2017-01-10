import { inject } from "@tandem/common";
import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands/base";
import { RootCollaboratorStoreProvider } from "../../common/providers";
import { CollaborateRootStore } from "../stores";

export abstract class BaseCollaborateExtensionCommand extends BaseEditorBrowserCommand {

  @inject(RootCollaboratorStoreProvider.ID)
  readonly collaboratorStore: CollaborateRootStore;
}