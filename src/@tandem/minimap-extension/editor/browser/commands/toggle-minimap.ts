import { BaseMinimapBrowserCommand } from "./base";

export class ToggleMinimapCommand extends BaseMinimapBrowserCommand {
  execute() {
    this.minimapStore.showMinimap = !this.minimapStore.showMinimap;
  }
}