import { Dependencies, Dependency, createSingletonDependencyClass } from "@tandem/common";
import { ModuleHistory } from "./history";

export const HistorySingletonDependency = createSingletonDependencyClass(ModuleHistory.DEPENDENCY_ID, ModuleHistory);