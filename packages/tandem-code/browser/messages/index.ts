import { IMessage } from "@tandem/mesh";

export class OpenRequest implements IMessage {
  static readonly OPEN = "open";
  readonly type = OpenRequest.OPEN;
}