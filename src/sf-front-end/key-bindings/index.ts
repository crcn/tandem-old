import { KeyBindingDependency } from "sf-front-end/dependencies";
import { ZoomInAction, ZoomOutAction } from "sf-front-end/actions";
import { KeyBinding } from "./base";

export const dependency = [
  new KeyBindingDependency(new KeyBinding("meta+=", new ZoomInAction())),
  new KeyBindingDependency(new KeyBinding("meta+-", new ZoomOutAction()))
];
