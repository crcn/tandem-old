
import { WrapBus } from "mesh";
import { debounce } from "lodash";
import { DocumentFileAction } from "@tandem/editor/actions";
import {
  File,
  IPoint,
  inject,
  Action,
  IActor,
  bindable,
  IASTNode,
  BubbleBus,
  Transform,
  IDisposable,
  IObservable,
  bindProperty,
  IInjectable,
  BaseASTNode,
  EntityAction,
  Dependencies,
  patchTreeNode,
  watchProperty,
  IASTNodeLoader,
  DEPENDENCIES_NS,
  PropertyChangeAction,
  DependenciesDependency,
  IFileModelActionResponseData,
} from "@tandem/common";

import {
  SyntheticBrowser,
  SyntheticDocument
} from "@tandem/synthetic-browser";

export interface IEditorTool extends IActor, IDisposable {
  readonly editor: IEditor;
  readonly name: string;
  readonly cursor: string;
}

export interface IEditor extends IActor {
  currentTool: IEditorTool;
  selection: Array<any>;
  transform: Transform;
  readonly type: string;
  readonly cursor: string;
  readonly browser: SyntheticBrowser;
  readonly document: SyntheticDocument;
}

export abstract class BaseEditorTool implements IEditorTool, IInjectable {
  abstract name: string;
  readonly cursor: string = undefined;
  constructor(readonly editor: IEditor) { }

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