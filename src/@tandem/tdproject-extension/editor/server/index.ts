import { createTDProjectCoreDependencies } from "../../core";

export const createTDProjectEditorServerDependencies = () => {
  return [
    ...createTDProjectCoreDependencies()
  ];
}

export * from "../../core";