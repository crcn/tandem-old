import { Action } from "aerial-common2";

export type Shortcut = {
  keyCombo: string;
  action: Action;
  options: ShortcutOptions;
}

export type ShortcutServiceState = {
  shortcuts: Shortcut[]
};

export type ShortcutOptions = {
  keyup: boolean;
}


export const createKeyboardShortcut = (keyCombo: string, action: Action, options: ShortcutOptions = { keyup: false }): Shortcut => ({
  keyCombo,
  action,
  options
})