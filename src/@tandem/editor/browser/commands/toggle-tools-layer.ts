import { BaseEditorBrowserCommand } from "./base";

export class toggleStageToolsCommand extends BaseEditorBrowserCommand {
  execute() {
    this.editorStore.workspace.toggleStageTools();
  }
}