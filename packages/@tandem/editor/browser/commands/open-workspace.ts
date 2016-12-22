import { Workspace } from "@tandem/editor/browser/stores";
import { BoundingRect } from "@tandem/common";
import { OpenWorkspaceRequest } from "@tandem/editor/common";
import { BaseEditorBrowserCommand } from "./base";
import { EditorRouteNames } from "@tandem/editor/browser/constants";
import { RedirectRequest } from "@tandem/editor/browser/messages";

import { 
  BaseRenderer, 
  SyntheticDOMRenderer, 
  BaseDecoratorRenderer, 
  RemoteSyntheticBrowser, 
} from "@tandem/synthetic-browser";

export class OpenWorkspaceCommand extends BaseEditorBrowserCommand {
  async execute({ project }: OpenWorkspaceRequest) {
    // TODO - create new channel based in project
    const workspace = this.kernel.inject(new Workspace(project));
    await workspace.openBrowser();
    this.editorStore.workspace = workspace;
  }
}
