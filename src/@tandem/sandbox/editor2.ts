import { flatten } from "lodash";
import { WrapBus } from "mesh";
import { FileCache } from "./file-cache";
import { ISyntheticObject } from "./synthetic";
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
  getSerializeType,
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

  protected abstract findTargetASTNode(root: T, target: ISyntheticObject): T;
  protected abstract parseContent(filePath: string, content: string): Promise<T>|T;
  protected abstract getFormattedContent(root: T): string;
}

export abstract class EditAction extends Action {
  readonly target: ISyntheticObject;
  constructor(actionType: string, target: ISyntheticObject) {
    super(actionType);
    this.currentTarget = target;
  }
}

@serializable({
  serialize({ type, target, child, index }: InsertChildEditAction) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone()),
      index: index
    };
  },
  deserialize({ type, target, child, index }, dependencies): InsertChildEditAction {
    return new InsertChildEditAction(
      type,
      deserialize(target, dependencies),
      deserialize(child, dependencies),
      index
    );
  }
})
export class InsertChildEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, readonly child: ISyntheticObject, readonly index: number) {
    super(actionType, target);
  }
}

@serializable({
  serialize({ type, target, child }: RemoveChildEditAction) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone())
    };
  },
  deserialize({ type, target, child, newIndex }, dependencies): RemoveChildEditAction {
    return new RemoveChildEditAction(
      type,
      deserialize(target, dependencies),
      deserialize(child, dependencies)
    );
  }
})
export class RemoveChildEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, readonly child: ISyntheticObject) {
    super(actionType, target);
  }
}

@serializable({
  serialize({ type, target, child, newIndex }: MoveChildEditAction) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone()),
      newIndex: newIndex
    };
  },
  deserialize({ type, target, child, newIndex }, dependencies): MoveChildEditAction {
    return new MoveChildEditAction(
      type,
      deserialize(target, dependencies),
      deserialize(child, dependencies),
      newIndex
    );
  }
})
export class MoveChildEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, readonly child: ISyntheticObject, readonly newIndex: number) {
    super(actionType, target);
  }
}

@serializable({
  serialize({ type, target, name, newValue, newName }: SetKeyValueEditAction) {
    return {
      type: type,
      target: serialize(target.clone()),
      name: name,
      newValue: serialize(newValue),
      newName: newName
    };
  },
  deserialize({ type, target, name, newValue, newName }, dependencies): SetKeyValueEditAction {
    return new SetKeyValueEditAction(
      type,
      deserialize(target, dependencies),
      name,
      deserialize(newValue, dependencies),
      newName
    );
  }
})
export class SetKeyValueEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, readonly  name: string, readonly newValue: any, readonly newName?: string) {
    super(actionType, target);
  }
}

@serializable({
  serialize({ type, target, newValue }: SetValueEditActon) {
    return {
      type: type,
      target: serialize(target.clone()),
      newValue: newValue
    };
  },
  deserialize({ type, target, newValue }, dependencies): SetValueEditActon {
    return new SetValueEditActon(
      type,
      deserialize(target, dependencies),
      newValue
    );
  }
})
export class SetValueEditActon extends EditAction {
  constructor(type: string, target: ISyntheticObject, readonly newValue: any) {
    super(type, target);
  }
}

/**
 * Removes the target synthetic object
 */

export class RemoveEditAction extends EditAction {
  static readonly REMOVE_EDIT = "removeEdit";
  constructor(target: ISyntheticObject) {
    super(RemoveEditAction.REMOVE_EDIT, target);
  }
}

export interface IContentEdit {
  readonly actions: EditAction[];
}

export class BatchContentEdit implements IContentEdit {
  constructor(readonly actions: EditAction[]) { }
}


export abstract class BaseContentEdit<T extends ISyntheticObject> {
  private _actions: EditAction[];

  constructor(readonly target: T) {
    this._actions = [];
  }

  get actions(): EditAction[] {
    return this._actions;
  }

  abstract addDiff(newSynthetic: T): BaseContentEdit<T>;

  protected addAction(action: EditAction) {
    this._actions.push(action);
    return this;
  }

  protected addChildEdit(edit: IContentEdit) {
    this._actions.push(...edit.actions);
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
