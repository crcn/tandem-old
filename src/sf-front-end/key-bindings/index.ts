import { KeyBindingDependency } from "sf-front-end/dependencies";
import { ZoomAction } from "sf-front-end/actions";
import { KeyBinding } from "./base";

const ZOOM_INCREMENT = 0.1;

export const dependency = [
  new KeyBindingDependency(new KeyBinding("meta+=", new ZoomAction(ZOOM_INCREMENT))),
  new KeyBindingDependency(new KeyBinding("meta+-", new ZoomAction(-ZOOM_INCREMENT)))
];
