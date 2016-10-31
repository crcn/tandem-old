import { Action } from "@tandem/common/actions";
import { KeyBinding } from "./base";
import { Store } from "@tandem/editor/browser/models";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { pointerToolProvider } from "@tandem/editor/browser/models/pointer-tool";
import { GlobalKeyBindingProvider } from "@tandem/editor/browser/providers";
import { BaseCommand, inject, Metadata } from "@tandem/common";
import { WorkspaceToolFactoryProvider, StoreProvider } from "@tandem/editor/browser/providers";
import { SettingKeys, ZOOM_INCREMENT, POINTER_TOOL_KEY_CODE } from "@tandem/editor/browser/constants";
import { SelectAllAction, SetToolAction, ZoomAction, DeleteSelectionAction } from "@tandem/editor/browser/actions";

class ToggleLeftSidebarCommand extends BaseCommand {
  @inject(StoreProvider.ID)
  private _store: Store;
  execute(action: Action) {
    this._store.settings.toggle(SettingKeys.HIDE_LEFT_SIDEBAR);
  }
}

class ToggleRightSidebarCommand extends BaseCommand {
  @inject(StoreProvider.ID)
  private _store: Store;
  execute(action: Action) {
    this._store.settings.toggle(SettingKeys.HIDE_RIGHT_SIDEBAR);
  }
}

export const keyBindingsProviders = [
  new GlobalKeyBindingProvider("meta+=", class ZoomInCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(ZOOM_INCREMENT, true));
    }
  }),
  new GlobalKeyBindingProvider([POINTER_TOOL_KEY_CODE, "escape"], class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {

      // slight delay to enable other tools to catch escape key if it' s hit - important
      // for text editing tool particularly
      setTimeout(() => {
        this.bus.execute(new SetToolAction(this.injector.query<WorkspaceToolFactoryProvider>(pointerToolProvider.id)));
      }, 1);
    }
  }),
  new GlobalKeyBindingProvider("meta+-", class ZoomOutCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(-ZOOM_INCREMENT, true));
    }
  }),
  new GlobalKeyBindingProvider("backspace", class DeleteSelectionCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new DeleteSelectionAction());
    }
  }),
  new GlobalKeyBindingProvider("meta+a", class DeleteSelectionCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SelectAllAction());
    }
  }),
  new GlobalKeyBindingProvider("meta+x", class CutCommand extends BaseCommand {
    execute(action: Action) {
      document.execCommand("copy");
      this.bus.execute(new DeleteSelectionAction());
    }
  }),
  new GlobalKeyBindingProvider("alt+\\", ToggleLeftSidebarCommand),
  new GlobalKeyBindingProvider("alt+/", ToggleRightSidebarCommand),
];

export * from "./base";
