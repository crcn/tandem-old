import { HistorySliderComponent } from "./components/footer/slider";
import { HistorySingletonDependency } from "./dependencies";
import { FooterComponentFactoryDependency, GlobalKeyBindingDependency } from "@tandem/editor/dependencies";
import { CommandFactoryDependency, InitializeAction, isMaster } from "@tandem/common";

import { InitializeHistoryCommand, UndoComand, RedoCommand } from "./commands";

export const historyExtensionDependencies = isMaster ? [
  new FooterComponentFactoryDependency("history", HistorySliderComponent),
  new HistorySingletonDependency(),
  new CommandFactoryDependency(InitializeAction.INITIALIZE, InitializeHistoryCommand),
  new GlobalKeyBindingDependency("meta+z", UndoComand),
  new GlobalKeyBindingDependency("meta+y", RedoCommand)
] : [];