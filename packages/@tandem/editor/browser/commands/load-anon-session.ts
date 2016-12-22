import { BaseEditorBrowserCommand } from "./base";
import { Anon } from "@tandem/editor/common";

export class LoadAnonSession extends BaseEditorBrowserCommand {
  execute() {
    this.editorStore.user = new Anon();
  }
}