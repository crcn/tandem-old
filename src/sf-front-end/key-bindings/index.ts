import { KeyBindingFragment } from "sf-front-end/fragments";
import { ZoomInAction, ZoomOutAction } from "sf-front-end/actions";
import { KeyBinding } from "./base";

export const fragment = [
  new KeyBindingFragment(new KeyBinding("meta+=", new ZoomInAction())),
  new KeyBindingFragment(new KeyBinding("meta+-", new ZoomOutAction()))
];
