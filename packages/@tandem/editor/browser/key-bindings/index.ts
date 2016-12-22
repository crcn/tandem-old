import { IMessage } from "@tandem/mesh";
import { KeyBinding } from "./base";
import { EditorStore } from "@tandem/editor/browser/stores";
import { pointerToolProvider } from "@tandem/editor/browser/stores/pointer-tool";
import { GlobalKeyBindingProvider } from "@tandem/editor/browser/providers";
import { BaseCommand, inject, Metadata } from "@tandem/common";
import { WorkspaceToolFactoryProvider, EditorStoreProvider } from "@tandem/editor/browser/providers";
import { SettingKeys, ZOOM_INCREMENT, POINTER_TOOL_KEY_CODE } from "@tandem/editor/browser/constants";
import { SelectAllRequest, SetToolRequest, ZoomInRequest, ZoomOutRequest, RemoveSelectionRequest } from "@tandem/editor/browser/messages";

class ToggleLeftSidebarCommand extends BaseCommand {
  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;
  execute(message: IMessage) {
    this._store.settings.toggle(SettingKeys.HIDE_LEFT_SIDEBAR);
  }
}

class ToggleRightSidebarCommand extends BaseCommand {
  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;
  execute(message: IMessage) {
    this._store.settings.toggle(SettingKeys.HIDE_RIGHT_SIDEBAR);
  }
}

export const keyBindingsProviders = [
  new GlobalKeyBindingProvider("meta+=", class ZoomInCommand extends BaseCommand {
    execute(message: IMessage) {
      this.bus.dispatch(new ZoomInRequest());
    }
  }),
  new GlobalKeyBindingProvider([POINTER_TOOL_KEY_CODE, "escape"], class SetPointerToolCommand extends BaseCommand {
    execute(message: IMessage) {

      // slight delay to enable other tools to catch escape key if it' s hit - important
      // for text editing tool particularly
      setTimeout(() => {
        this.bus.dispatch(new SetToolRequest(this.kernel.query<WorkspaceToolFactoryProvider>(pointerToolProvider.id)));
      }, 1);
    }
  }),
  new GlobalKeyBindingProvider("meta+-", class ZoomOutCommand extends BaseCommand {
    execute(message: IMessage) {
      this.bus.dispatch(new ZoomOutRequest());
    }
  }),
  new GlobalKeyBindingProvider("backspace", class DeleteSelectionCommand extends BaseCommand {
    execute(message: IMessage) {
      this.bus.dispatch(new RemoveSelectionRequest());
    }
  }),
  new GlobalKeyBindingProvider("meta+a", class DeleteSelectionCommand extends BaseCommand {
    execute(message: IMessage) {
      this.bus.dispatch(new SelectAllRequest());
    }
  }),
  new GlobalKeyBindingProvider("meta+x", class CutCommand extends BaseCommand {
    execute(message: IMessage) {
      document.execCommand("copy");
      this.bus.dispatch(new RemoveSelectionRequest());
    }
  }),
  new GlobalKeyBindingProvider("alt+\\", ToggleLeftSidebarCommand),
  new GlobalKeyBindingProvider("alt+/", ToggleRightSidebarCommand),
];

export * from "./base";
