
import { debounce } from "lodash";
import { CallbackDispatcher } from "@tandem/mesh";
import {
  File,
  IPoint,
  inject,
  Action,
  bindable,
  BubbleDispatcher,
  Transform,
  IDisposable,
  IObservable,
  bindProperty,
  IInjectable,
  Injector,
  watchProperty,
  InjectorProvider,
} from "@tandem/common";

import { IDispatcher } from "@tandem/mesh";

import {
  ISyntheticBrowser,
  SyntheticBrowser,
  SyntheticDocument
} from "@tandem/synthetic-browser";

export interface IWorkspaceTool extends IDispatcher<any, any>, IDisposable {
  readonly editor: any;
  readonly name: string;
  readonly cursor: string;
}

export abstract class BaseEditorTool implements IWorkspaceTool, IInjectable {
  abstract name: string;
  readonly cursor: string = undefined;
  constructor(readonly editor: any) { }

  dispose() { }

  dispatch(action: Action) {
    if (this[action.type]) {
      return this[action.type](action);
    }
  }
}

export interface IHistoryItem {
  use(): void;
}