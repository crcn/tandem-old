import { KeyBindingDependency } from "sf-front-end/dependencies";
import { SelectAllAction } from "sf-front-end/actions";
import { ZoomAction, DeleteSelectionAction } from "sf-front-end/actions";
import { KeyBinding } from "./base";

export * from "./base";

const ZOOM_INCREMENT = 0.1;

export const dependency = [
  new KeyBindingDependency(new KeyBinding("meta+=", new ZoomAction(ZOOM_INCREMENT))),
  new KeyBindingDependency(new KeyBinding("meta+-", new ZoomAction(-ZOOM_INCREMENT))),
  new KeyBindingDependency(new KeyBinding("backspace", new DeleteSelectionAction()))
  new KeyBindingDependency(new KeyBinding("meta+a", new SelectAllAction()))
];
