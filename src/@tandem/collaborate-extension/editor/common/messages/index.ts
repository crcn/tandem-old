import { Message, IStreamableDispatcher, readOneChunk, setMessageTarget } from "@tandem/mesh";
import { EditorFamilyType } from "@tandem/editor/common";


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

@setMessageTarget(EditorFamilyType.MASTER)
export class StartWorkspaceTunnelRequest extends Message {
  static readonly START_WORKSPACE_TUNNEL = "startWorkspaceTunnel";
  constructor() {
    super(StartWorkspaceTunnelRequest.START_WORKSPACE_TUNNEL);
  }

  static async dispatch(bus: IStreamableDispatcher<any>): Promise<{ url: string }> {
    return (await readOneChunk(bus.dispatch(new StartWorkspaceTunnelRequest()))).value;
  }
}