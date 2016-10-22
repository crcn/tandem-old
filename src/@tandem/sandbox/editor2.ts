import { flatten } from "lodash";
import { WrapBus } from "mesh";
import { FileCache } from "./file-cache";
import { ISynthetic } from "./synthetic";
import { FileEditorAction } from "./actions";
import { FileCacheDependency, ContentEditorFactoryDependency } from "./dependencies";
import {
  Action,
  inject,
  serialize,
  Observable,
  deserialize,
  Dependencies,
  serializable,
  ISerializable,
  SingletonThenable,
  ISerializedContent,
  MimeTypeDependency,
  DependenciesDependency,
} from "@tandem/common";

export type contentEditorType = { new(): IContentEditor };

// TODO - change to IContentEditConsumr
export interface IContentEditor {
  getEditedContent(filePath: string, content: string, actions: Action[]): Promise<string>|string;
}

export abstract class BaseContentEditor<T> implements IContentEditor {
  async getEditedContent(filePath: string, content: string, actions: EditAction[]): Promise<string> {
    const rootASTNode = await this.parseContent(filePath, content);
    for (const action of actions) {
      const method = this[action.type];
      const targetASTNode = this.findTargetASTNode(rootASTNode, action.target);
      if (method && targetASTNode) {
        method.call(this, targetASTNode, action);
      } else {
        console.error(`Cannot apply edit ${action.type} on ${filePath}.`);
      }
    }
    return this.getFormattedContent(rootASTNode);
  }

  protected abstract findTargetASTNode(root: T, target: ISynthetic): T;
  protected abstract parseContent(filePath: string, content: string): Promise<T>|T;
  protected abstract getFormattedContent(root: T): string;
}

// TODO - may want to use
export enum EditKind {
  REMOVE = 1,
  UPDATE = REMOVE + 1,
  INSERT = UPDATE + 1
}

export abstract class EditAction extends Action {
  readonly target: ISynthetic;
  constructor(actionType: string, public editKind: EditKind, target: ISynthetic) {
    super(actionType);
    this.currentTarget = target;
  }
}


/**
 * Removes the target synthetic object
 */

export class RemoveEditAction extends EditAction {
  static readonly REMOVE_EDIT = "removeEdit";
  constructor(target: ISynthetic) {
    super(RemoveEditAction.REMOVE_EDIT, EditKind.REMOVE, target);
  }
}

export interface IContentEdit {
  readonly actions: EditAction[];
}

export class BatchContentEdit implements IContentEdit {
  constructor(readonly actions: EditAction[]) {

  }
}

export abstract class BaseContentEdit<T extends ISynthetic> {
  private _actions: EditAction[];

  constructor(readonly target: T) {
    this._actions = [];
  }

  get actions(): EditAction[] {
    return this._actions;
  }

  protected addAction(action: EditAction) {
    this._actions.push(action);
    return this;
  }
}

export class FileEditor extends Observable {

  private _editing: boolean;
  private _edits: IContentEdit[];
  private _shouldEditAgain: boolean;

  @inject(DependenciesDependency.NS)
  private _dependencies: Dependencies;

  constructor() {
    super();
  }

  applyEdit(edit: IContentEdit): Promise<any> {

    if (this._edits == null) {
      this._shouldEditAgain = true;
      this._edits = [];
    }

    this._edits.push(edit);
    this.run();

    return new Promise((resolve) => {
      const observer = new WrapBus((action: Action) => {
        if (action.type === FileEditorAction.BUNDLE_EDITED) {
          resolve();
          this.unobserve(observer);
        }
      });
      this.observe(observer);
    });
  }

  private run() {
    if (this._editing) return;
    this._editing = true;
    setTimeout(async () => {
      this._shouldEditAgain = false;
      // const fileCache = await this.bundle.getSourceFileCacheItem();
      const actions = flatten(this._edits.map(edit => edit.actions));
      this._edits = undefined;

      const actionsByFilePath = {};

      // find all actions that are part of the same file and
      // batch them together
      for (const action of actions) {
        const target = action.target;

        // This may happen if edits are being applied to synthetic objects that
        // do not have the proper mappings
        if (!target.source || !target.source.filePath) {
          console.error(`Cannot edit synthetic objects that do not have a defined source.`);
          continue;
        }

        const targetSource = target.source;

        const filePathActions: EditAction[] = actionsByFilePath[targetSource.filePath] || (actionsByFilePath[targetSource.filePath] = []);

        filePathActions.push(action);
      }

      const promises = [];

      for (const filePath in actionsByFilePath) {
        const contentEditorFactoryDependency = ContentEditorFactoryDependency.find(MimeTypeDependency.lookup(filePath, this._dependencies), this._dependencies);

        if (!contentEditorFactoryDependency) {
          console.error(`No synthetic edit consumer exists for ${filePath}.`);
          continue;
        }

        const contentEditor = contentEditorFactoryDependency.create();
        const fileCache     = await  FileCacheDependency.getInstance(this._dependencies).item(filePath);
        const oldContent    = await fileCache.read();
        const newContent    = await contentEditor.getEditedContent(filePath, oldContent, actionsByFilePath[filePath]);

        console.log("new content", newContent);
        fileCache.setDataUrl(newContent);
        promises.push(fileCache.save());
      }

      await Promise.all(promises);

      // TODO - need to have rejection handling for various edits
      this._editing = false;
      this.notify(new FileEditorAction(FileEditorAction.BUNDLE_EDITED));

      // edits happened during getEditedContent call
      if (this._shouldEditAgain) {
        this.run();
      }
    }, 0);
  }
}
