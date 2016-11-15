import { ModuleHistory } from "@tandem/history-extension/history";
import {
  Action,
  ICommand,
  inject,
  IInjectable,
} from "@tandem/common";


export class InitializeHistoryCommand implements ICommand {

  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: Action) {
    return this._history.initialize();
  }
}

export class UndoComand implements ICommand {
  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: Action) {
    this._history.position--;
  }
}

export class RedoCommand implements ICommand {
  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: Action) {
    this._history.position++;
  }
}