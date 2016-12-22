
import { debounce } from "lodash";
import { CallbackDispatcher } from "@tandem/mesh";
import {
  IPoint,
  inject,
  CoreEvent,
  bindable,
  BubbleDispatcher,
  Transform,
  IDisposable,
  IObservable,
  bindProperty,
  IInjectable,
  Kernel,
  watchProperty,
  KernelProvider,
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

  dispatch(message: CoreEvent) {
    if (this[message.type]) {
      return this[message.type](message);
    }
  }
}

export interface IHistoryItem {
  use(): void;
}