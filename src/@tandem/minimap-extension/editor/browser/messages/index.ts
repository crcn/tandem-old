import { IMessage } from "@tandem/mesh";

export class ToggleMinimapRequest implements IMessage {
  static readonly TOGGLE_MINI_MAP = "toggleMiniMap";
  readonly type = ToggleMinimapRequest.TOGGLE_MINI_MAP;
}