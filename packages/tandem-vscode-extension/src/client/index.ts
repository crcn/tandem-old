import { ExtensionContext } from "vscode";
import * as preview from "./preview";

export const activate = (context: ExtensionContext) => {
  preview.activate(context);
};