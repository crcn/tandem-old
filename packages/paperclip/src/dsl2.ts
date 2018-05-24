import { TreeNode } from "tandem-common";

export type PCModuleImports = {
  // namespace: path
  [identifier: string]: string;
};

export type PCModule = {
  imports: PCModuleImports;
};

export type PCComponent = {
  id: string;
  template: TreeNode;
};
