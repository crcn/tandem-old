import { createNativeNode } from "./native-renderer";

export class Renderer {
  private _scopeFilePath: string;
  readonly mount: HTMLDivElement;
  constructor(readonly protocol: string) {
    this.mount = document.createElement("div");
  }

  handleEngineEvent(event) {
    // only accept events scoped to current file path
    if (event.kind !== "Evaluated" && event.file_path !== this._scopeFilePath) {
      return;
    }
    switch (event.kind) {
      case "Evaluated": {
        while (this.mount.childNodes.length) {
          this.mount.removeChild(this.mount.childNodes[0]);
        }
        this._scopeFilePath = event.file_path;
        const node = createNativeNode(event.node, this.protocol);
        this.mount.appendChild(node);
      }
      case "Diffed": {
        // TODO
      }
    }
  }
}
