import { GlobalKeyBindingDependency } from "sf-front-end/dependencies";
import { SelectAllAction } from "sf-front-end/actions";
import { ZoomAction, DeleteSelectionAction } from "sf-front-end/actions";
import { KeyBinding } from "./base";

export * from "./base";
export * from "./manager";

const ZOOM_INCREMENT = 0.1;

export const dependency = [
  new GlobalKeyBindingDependency(new KeyBinding("meta+=", new ZoomAction(ZOOM_INCREMENT))),
  new GlobalKeyBindingDependency(new KeyBinding("meta+-", new ZoomAction(-ZOOM_INCREMENT))),
  new GlobalKeyBindingDependency(new KeyBinding("backspace", new DeleteSelectionAction())),
  new GlobalKeyBindingDependency(new KeyBinding("meta+a", new SelectAllAction()))
];
