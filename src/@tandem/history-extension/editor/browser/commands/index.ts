import { ModuleHistory } from "@tandem/history-extension/history";
import {
  ICommand,
  inject,
  IInjectable,
} from "@tandem/common";
import { IMessage } from "@tandem/mesh";


export class InitializeHistoryCommand implements ICommand {

  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: IMessage) {
    return this._history.initialize();
  }
}

export class UndoComand implements ICommand {
  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: IMessage) {
    this._history.position--;
  }
}

export class RedoCommand implements ICommand {
  constructor(
    @inject(ModuleHistory.DEPENDENCY_ID) private _history: ModuleHistory
  ) {

  }

  execute(action: IMessage) {
    this._history.position++;
  }
}