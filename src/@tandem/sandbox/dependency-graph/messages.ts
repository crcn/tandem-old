import { Action } from "@tandem/common";

export class DependencyEvent extends Action {
  static readonly DEPENDENCY_LOADED = "dependencyReady";
}