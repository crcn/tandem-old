import { Message } from "@tandem/mesh";

export class ShareWorkspaceRequest extends Message {
  static readonly SHARE_WORKSPACE = "shareWorkspace";
  constructor() {
    super(ShareWorkspaceRequest.SHARE_WORKSPACE);
  }
}