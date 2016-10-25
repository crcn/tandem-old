import { htmlEditorExtensionDependencies } from "./editor";
import { htmlCoreExtensionDependencies } from "./core";

export const htmlExtensionDependencies = [
  ...htmlEditorExtensionDependencies,
  ...htmlCoreExtensionDependencies
];

export * from "./core";
export * from "./editor";
