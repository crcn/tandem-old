import { Action } from "sf-core/actions";
import { SettingKeys } from "sf-front-end/constants";
import { KeyBinding } from "./base";
import { FrontEndApplication } from "sf-front-end/application";
import { GlobalKeyBindingDependency } from "sf-front-end/dependencies";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { ZoomAction, DeleteSelectionAction } from "sf-front-end/actions";
import { BaseCommand, BaseApplicationCommand } from "sf-core/commands";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";
import { SelectAllAction, SetToolAction, UndoAction, RedoAction } from "sf-front-end/actions";

export * from "./base";
export * from "./manager";

const ZOOM_INCREMENT = 0.1;

export const dependency = [
  new GlobalKeyBindingDependency("meta+=", class ZoomInCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(ZOOM_INCREMENT, true));
    }
  }),
  new GlobalKeyBindingDependency("p", class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns)));
    }
  }),
  new GlobalKeyBindingDependency("meta+-", class ZoomOutCommand extends BaseCommand {
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
  new GlobalKeyBindingDependency("meta+z", class UndoActionCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new UndoAction());
    }
  }),
  new GlobalKeyBindingDependency("meta+y", class RedoActionCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new RedoAction());
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
