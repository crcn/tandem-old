import { GlobalKeyBindingDependency } from "sf-front-end/dependencies";
import { SelectAllAction, SetToolAction } from "sf-front-end/actions";
import { ZoomAction, DeleteSelectionAction } from "sf-front-end/actions";
import { KeyBinding } from "./base";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { Action } from "sf-core/actions";
import { BaseCommand } from "sf-core/commands";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";

export * from "./base";
export * from "./manager";

const ZOOM_INCREMENT = 0.1;


export const dependency = [
  new GlobalKeyBindingDependency("meta+=", class ZoomInCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(ZOOM_INCREMENT));
    }
  }),
  new GlobalKeyBindingDependency("p", class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns)));
    }
  }),
  new GlobalKeyBindingDependency("meta+-", class ZoomOutCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new ZoomAction(-ZOOM_INCREMENT));
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
  })
];
