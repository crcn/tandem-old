
import { WrapBus } from "mesh";
import { debounce } from "lodash";
import { DocumentFileAction } from "@tandem/editor/browser/actions";
import {
  File,
  IPoint,
  inject,
  Action,
  IActor,
  bindable,
  BubbleBus,
  Transform,
  IDisposable,
  IObservable,
  bindProperty,
  IInjectable,
  EntityAction,
  Dependencies,
  watchProperty,
  PropertyChangeAction,
  DependenciesProvider,
} from "@tandem/common";

import {
  ISyntheticBrowser,
  SyntheticBrowser,
  SyntheticDocument
} from "@tandem/synthetic-browser";

export interface IWorkspaceTool extends IActor, IDisposable {
  readonly editor: any;
  readonly name: string;
  readonly cursor: string;
}

export abstract class BaseEditorTool implements IWorkspaceTool, IInjectable {
  abstract name: string;
  readonly cursor: string = undefined;
  constructor(readonly editor: any) { }

  dispose() { }

  execute(action: Action) {
    if (this[action.type]) {
      return this[action.type](action);
    }
  }
}

export interface IHistoryItem {
  use(): void;
}