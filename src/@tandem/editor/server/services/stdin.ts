import * as readline from "readline";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";
import { InitializeAction, Action } from "@tandem/common";
import { StdinHandlerProvider } from "@tandem/editor/server/providers";

/**
 * console input command handler
 */

export class StdinService extends CoreApplicationService<IEdtorServerConfig> {

  private _rl: readline.ReadLine;

  [InitializeAction.INITIALIZE]() {
    this._rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.readInput();
  }

  private readInput = () => {
    this._rl.question("> ", this.onInput);
  }

  private onInput = async (text) => {
    const inputHandler = StdinHandlerProvider.findByInput(text, this.injector);

    try {
      if (inputHandler) {
        await inputHandler.handle(text);
      } else {
      }
    } catch(e) {
      console.error(e.message);
    }

    this.readInput();
  }

  private async handleDefault(text) {
    var action;

    try {
      action = (new Function(`return ${text};`))();
    } catch (e) {
      action = { type: text };
    }

    const { writable, readable } = this.bus.dispatch(action);
    const reader = readable.getReader();
    var value;
    var done;
    while ({ value, done } = await reader.read()) {
      if (done) break;
      console.info(value);
    }
  }
}