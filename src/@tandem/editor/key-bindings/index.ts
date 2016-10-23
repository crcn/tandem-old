import { Action } from "@tandem/common/actions";
import { KeyBinding } from "./base";
import { FrontEndApplication } from "@tandem/editor/application";
import { pointerToolDependency } from "@tandem/editor/models/pointer-tool";
import { GlobalKeyBindingDependency } from "@tandem/editor/dependencies";
import { WorkspaceToolFactoryDependency } from "@tandem/editor/dependencies";
import { SelectAllAction, SetToolAction } from "@tandem/editor/actions";
import { ZoomAction, DeleteSelectionAction } from "@tandem/editor/actions";
import { BaseCommand, BaseApplicationCommand } from "@tandem/common/commands";
import { SettingKeys, ZOOM_INCREMENT, POINTER_TOOL_KEY_CODE } from "@tandem/editor/constants";

export * from "./base";
export * from "./manager";

export const keyBindingsDependency = [
  new GlobalKeyBindingDependency("meta+=", class ZoomInCommand extends BaseApplicationCommand<FrontEndApplication> {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(ZOOM_INCREMENT, true));
    }
  }),
  new GlobalKeyBindingDependency([POINTER_TOOL_KEY_CODE, "escape"], class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {

      // slight delay to enable other tools to catch escape key if it' s hit - important
      // for text editing tool particularly
      setTimeout(() => {
        this.bus.execute(new SetToolAction(this.dependencies.query<WorkspaceToolFactoryDependency>(pointerToolDependency.id)));
      }, 1);
    }
  }),
  new GlobalKeyBindingDependency("meta+-", class ZoomOutCommand extends BaseApplicationCommand<FrontEndApplication> {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(-ZOOM_INCREMENT, true));
    }
  }),
  new GlobalKeyBindingDependency("backspace", class DeleteSelectionCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new DeleteSelectionAction());
    }
  }),
  new GlobalKeyBindingDependency("meta+a", class DeleteSelectionCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SelectAllAction());
    }
  }),
  new GlobalKeyBindingDependency("meta+x", class CutCommand extends BaseCommand {
    execute(action: Action) {
      document.execCommand("copy");
      this.bus.execute(new DeleteSelectionAction());
    }
  }),
  new GlobalKeyBindingDependency("alt+\\", class ToggleLeftSidebarCommand extends BaseApplicationCommand<FrontEndApplication> {
    execute(action: Action) {
      this.app.settings.toggle(SettingKeys.HIDE_LEFT_SIDEBAR);
    }
  }),
  new GlobalKeyBindingDependency("alt+/", class ToggleRightSidebarCommand extends BaseApplicationCommand<FrontEndApplication> {
    execute(action: Action) {
      this.app.settings.toggle(SettingKeys.HIDE_RIGHT_SIDEBAR);
    }
  }),
];
