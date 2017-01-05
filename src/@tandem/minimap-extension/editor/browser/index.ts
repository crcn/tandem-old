import { ToggleMinimapCommand } from "./commands";
import { ToggleMinimapRequest } from "./messages";
import { MinimapStageComponent } from "./components";
import { CommandFactoryProvider } from "@tandem/common";
import { StageToolComponentFactoryProvider } from "@tandem/editor/browser";

export const createMinimapBrowserExtensionProviders = () => {
  return [
    new StageToolComponentFactoryProvider("minimap", null, MinimapStageComponent),
    new CommandFactoryProvider(ToggleMinimapRequest.TOGGLE_MINI_MAP, ToggleMinimapCommand)
  ];
}