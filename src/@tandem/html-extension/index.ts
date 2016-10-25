import { htmlEditorExtensionDependencies } from "./editor";
import { htmlCoreExtensionDependencies } from "./core";

const htmlExtensionDependencies: any = [
  ...htmlCoreExtensionDependencies
];

if (typeof window !== "undefined") {
  htmlExtensionDependencies.push(...htmlEditorExtensionDependencies);
}

export { htmlExtensionDependencies };

export * from "./core";
export * from "./editor";
