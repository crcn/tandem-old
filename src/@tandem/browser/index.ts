
import { Dependencies, Sandbox } from "@tandem/common";

export class SyntheticBrowser {
  private _sandbox: Sandbox;

  constructor(private _dependencies: Dependencies) {

  }

  async open(path: string) {
    this._sandbox = new Sandbox(this._dependencies);
  }
}