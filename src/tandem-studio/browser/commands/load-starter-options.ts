import { BaseEditorBrowserCommand } from "@tandem/editor/browser";
import { BaseStudioEditorBrowserCommand } from "./base";
import { GetProjectStartOptionsRequest  } from "tandem-studio/common";

export class LoadStartOptionsCommand extends BaseStudioEditorBrowserCommand {
  async execute() {
    this.studioEditorStore.projectStarterOptions = await GetProjectStartOptionsRequest.dispatch(this.bus);
  }
}