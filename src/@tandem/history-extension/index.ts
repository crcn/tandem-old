// // TODO - move most of this logic to editor/ - epecially components

// import { HistorySliderComponent } from "./components/footer/slider";
// import { HistorySingletonProvider } from "./providers";
// import { InitializeHistoryCommand, UndoComand, RedoCommand } from "./commands";
// import { CommandFactoryProvider, InitializeApplicationRequest, isMaster } from "@tandem/common";
// import { FooterComponentFactoryProvider, GlobalKeyBindingProvider } from "@tandem/editor/providers";

// export const historyExtensionProviders = isMaster ? [
//   new FooterComponentFactoryProvider("history", HistorySliderComponent),
//   new HistorySingletonProvider(),
//   new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, InitializeHistoryCommand),
//   new GlobalKeyBindingProvider("meta+z", UndoComand),
//   new GlobalKeyBindingProvider("meta+y", RedoCommand)
// ] : [];

export const historyExtensionProviders = [];