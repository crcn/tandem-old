import { Dependencies, Dependency, createSingletonDependency } from "@tandem/common";
import { ModuleHistory } from "./history";

export const HistorySingletonDependency = createSingletonDependency("history", ModuleHistory);