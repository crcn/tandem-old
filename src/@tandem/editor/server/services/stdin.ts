import * as readline from "readline";
import { IApplication } from "@tandem/common/application";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";

/**
 * console input command handler
 */

export class StdinService extends CoreApplicationService<IEdtorServerConfig> {

  private _rl:readline.ReadLine;

  initialize() {
    this._rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this._readInput();
  }

  _readInput = () => {
    this._rl.question("> ", this._onInput);
  }

  _onInput = async (text) => {

    var action;

    try {
      action = (new Function(`return ${text};`))();
    } catch (e) {
      action = { type: text };
    }

    try {
      var response = this.bus.execute(action);
      var value;
      var done;
      while ({ value, done } = await response.read()) {
        if (done) break;
        console.info(value);
      }
    } catch (e) {
      console.error(e.message);
    }
    this._readInput();
  }
}