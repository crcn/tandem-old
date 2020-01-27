import { createNativeNode } from "./native-renderer";

export class Renderer {
  private _scopeFilePath: string;
  readonly mount: HTMLDivElement;
  constructor() {
    this.mount = document.createElement("div");
  }

  handleEngineEvent(event) {
    // only accept events scoped to current file path
    if (event.type !== "Evaluated" && event.file_path !== this._scopeFilePath) {
      return;
    }
    switch (event.type) {
      case "Evaluated": {
        while (this.mount.childNodes.length) {
          this.mount.removeChild(this.mount.childNodes[0]);
        }
        this._scopeFilePath = event.file_path;
        this.mount.appendChild(createNativeNode(event.node));
      }
      case "Diffed": {
        // TODO
      }
    }
  }
}