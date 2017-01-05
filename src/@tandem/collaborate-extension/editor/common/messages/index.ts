import { Message } from "@tandem/mesh";

export class ShareWorkspaceRequest extends Message {
  static readonly SHARE_WORKSPACE = "shareWorkspace";
  constructor() {
    super(ShareWorkspaceRequest.SHARE_WORKSPACE);
  }
}

export class SetDisplayNameRequest extends Message {
  static readonly SET_DISPLAY_NAME = "setDisplayName";
  constructor(readonly name: string, readonly sessionId: string) {
    super(SetDisplayNameRequest.SET_DISPLAY_NAME);
  }
}