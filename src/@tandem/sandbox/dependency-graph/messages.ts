import { CoreEvent } from "@tandem/common";

export class DependencyEvent extends CoreEvent {
  static readonly DEPENDENCY_LOADED = "dependencyReady";
}