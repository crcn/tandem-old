import { Status } from "@tandem/common"
import { IMessage } from "@tandem/mesh";
import { BaseEditorBrowserCommand } from "./base";
import { ToggleSettingRequest } from "../messages";

/**
 * Called once after the app has initialized
 */

export class ToggleSettingCommand extends BaseEditorBrowserCommand {
  execute({ settingName }: ToggleSettingRequest) {
    this.editorStore.settings.toggle(settingName);
  }
}