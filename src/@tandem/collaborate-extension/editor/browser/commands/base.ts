import { inject } from "@tandem/common";
import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands/base";
import { RootCollaboratorStoreProvider } from "../../common/providers";
import { BaseCollaborateExtensionCommand } from "../../common/commands";

export abstract class BaseCollaborateExtensionBrowserCommand extends BaseCollaborateExtensionCommand {
}