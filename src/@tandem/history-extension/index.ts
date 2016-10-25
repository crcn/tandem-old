// // TODO - move most of this logic to editor/ - epecially components

// import { HistorySliderComponent } from "./components/footer/slider";
// import { HistorySingletonDependency } from "./dependencies";
// import { InitializeHistoryCommand, UndoComand, RedoCommand } from "./commands";
// import { CommandFactoryDependency, InitializeAction, isMaster } from "@tandem/common";
// import { FooterComponentFactoryDependency, GlobalKeyBindingDependency } from "@tandem/editor/dependencies";

// export const historyExtensionDependencies = isMaster ? [
//   new FooterComponentFactoryDependency("history", HistorySliderComponent),
//   new HistorySingletonDependency(),
//   new CommandFactoryDependency(InitializeAction.INITIALIZE, InitializeHistoryCommand),
//   new GlobalKeyBindingDependency("meta+z", UndoComand),
//   new GlobalKeyBindingDependency("meta+y", RedoCommand)
// ] : [];

export const historyExtensionDependencies = [];