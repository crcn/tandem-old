import { Action } from "@tandem/common/actions";
import { KeyBinding } from "./base";
import { Store } from "@tandem/editor/browser/models";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { pointerToolDependency } from "@tandem/editor/browser/models/pointer-tool";
import { GlobalKeyBindingDependency } from "@tandem/editor/browser/dependencies";
import { BaseCommand, inject, Metadata } from "@tandem/common";
import { WorkspaceToolFactoryDependency, StoreDependency } from "@tandem/editor/browser/dependencies";
import { SettingKeys, ZOOM_INCREMENT, POINTER_TOOL_KEY_CODE } from "@tandem/editor/browser/constants";
import { SelectAllAction, SetToolAction, ZoomAction, DeleteSelectionAction } from "@tandem/editor/browser/actions";

class ToggleLeftSidebarCommand extends BaseCommand {
  @inject(StoreDependency.ID)
  private _store: Store;
  execute(action: Action) {
    this._store.settings.toggle(SettingKeys.HIDE_LEFT_SIDEBAR);
  }
}

class ToggleRightSidebarCommand extends BaseCommand {
  @inject(StoreDependency.ID)
  private _store: Store;
  execute(action: Action) {
    this._store.settings.toggle(SettingKeys.HIDE_RIGHT_SIDEBAR);
  }
}

export const keyBindingsDependency = [
  new GlobalKeyBindingDependency("meta+=", class ZoomInCommand extends BaseCommand {
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
  new GlobalKeyBindingDependency("alt+\\", ToggleLeftSidebarCommand),
  new GlobalKeyBindingDependency("alt+/", ToggleRightSidebarCommand),
];

export * from "./base";
