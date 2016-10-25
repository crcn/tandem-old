import { createSASSSandboxDependencies } from "../../index";

export const createSASSEditorWorkerDependencies = () => {
  return [
    ...createSASSSandboxDependencies()
  ];
};