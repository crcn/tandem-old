import { BaseModule, Component, ComponentOverride } from "./dsl";

export type Dependency = {

  // URI used here since it could be a url
  uri: string;
  dirty?: boolean; // TRUE if the contents have changed
  originalModule: BaseModule; // 
  module: BaseModule;
};

export type DependencyGraph = {
  [identifier: string]: Dependency
};

