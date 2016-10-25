import { ModuleHistory } from "@tandem/history-extension/history";
import {
  Action,
  IActor,
  inject,
  IInjectable,
} from "@tandem/common";


export class InitializeHistoryCommand implements IActor {

  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: Action) {
    return this._history.initialize();
  }
}

export class UndoComand implements IActor {
  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: Action) {
    this._history.position--;
  }
}

export class RedoCommand implements IActor {
  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: Action) {
    this._history.position++;
  }
}