
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
  patchTreeNode,
  watchProperty,
  PropertyChangeAction,
  DependenciesDependency,
} from "@tandem/common";

import {
  ISyntheticBrowser,
  SyntheticBrowser,
  SyntheticDocument
} from "@tandem/synthetic-browser";

export interface IWorkspaceTool extends IActor, IDisposable {
  readonly editor: IWorkspace;
  readonly name: string;
  readonly cursor: string;
}

export interface IWorkspace extends IActor {
  currentTool: IWorkspaceTool;
  selection: Array<any>;
  transform: Transform;
  readonly type: string;
  readonly cursor: string;
  readonly browser: ISyntheticBrowser;
  readonly document: SyntheticDocument;
}

export abstract class BaseEditorTool implements IWorkspaceTool, IInjectable {
  abstract name: string;
  readonly cursor: string = undefined;
  constructor(readonly editor: IWorkspace) { }

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