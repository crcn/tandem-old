import { flatten } from "lodash";
import { WrapBus } from "mesh";
import { FileCache } from "../file-cache";
import { ISyntheticObject } from "../synthetic";
import { FileEditorAction } from "../actions";
import { FileCacheProvider, ContentEditorFactoryProvider } from "../providers";
import {
  Action,
  inject,
  serialize,
  loggable,
  Logger,
  Observable,
  deserialize,
  flattenTree,
  Injector,
  serializable,
  ISerializable,
  getSerializeType,
  ISerializedContent,
  MimeTypeProvider,
  InjectorProvider,
} from "@tandem/common";

export type contentEditorType = { new(filePath: string, content: string): IEditor };

export interface IEditor {
  applyEditActions(...actions: EditAction[]): any;
}

export interface IEditable {
  createEdit(): IContentEdit;
  applyEditAction(action: EditAction): any;
}

export interface IDiffable {
  createDiff(source: ISyntheticObject): IContentEdit;
}

export abstract class BaseContentEditor<T> implements IEditor {

  private _rootASTNode: T;

  constructor(readonly fileName: string, readonly content: string) {
    this._rootASTNode = this.parseContent(content);
  }

  // add filePath and content in constructor here instead
  applyEditActions(...actions: EditAction[]): any {
    for (const action of actions) {
      const method = this[action.type];
      const targetASTNode = this.findTargetASTNode(this._rootASTNode, action.target);
      if (method && targetASTNode) {
        method.call(this, targetASTNode, action);
      } else {
        console.error(`Cannot apply edit ${action.type} on ${this.fileName}.`);
      }
    }
    return this.getFormattedContent(this._rootASTNode);
  }

  protected abstract findTargetASTNode(root: T, target: ISyntheticObject): T;
  protected abstract parseContent(content: string): T;
  protected abstract getFormattedContent(root: T): string;
}

@serializable({
  serialize({ type, target }: EditAction) {
    return {
      type: type,
      target: serialize(target.clone())
    };
  },
  deserialize({ type, target }, injector): EditAction {
    return new EditAction(
      type,
      deserialize(target, injector)
    );
  }
})
export class EditAction extends Action {
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
      child: serialize(child.clone(true)),
      index: index
    };
  },
  deserialize({ type, target, child, index }, injector): InsertChildEditAction {
    return new InsertChildEditAction(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      index
    );
  }
})
export class InsertChildEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, readonly child: ISyntheticObject, readonly index: number = Infinity) {
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
  deserialize({ type, target, child, newIndex }, injector): RemoveChildEditAction {
    return new RemoveChildEditAction(
      type,
      deserialize(target, injector),
      deserialize(child, injector)
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
  deserialize({ type, target, child, newIndex }, injector): MoveChildEditAction {
    return new MoveChildEditAction(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      newIndex
    );
  }
})
export class MoveChildEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, readonly child: any, readonly newIndex: number) {
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
  deserialize({ type, target, name, newValue, newName }, injector): SetKeyValueEditAction {
    return new SetKeyValueEditAction(
      type,
      deserialize(target, injector),
      name,
      deserialize(newValue, injector),
      newName
    );
  }
})
export class SetKeyValueEditAction extends EditAction {
  constructor(actionType: string, target: ISyntheticObject, public  name: string, public newValue: any, public newName?: string) {
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
  deserialize({ type, target, newValue }, injector): SetValueEditActon {
    return new SetValueEditActon(
      type,
      deserialize(target, injector),
      newValue
    );
  }
})
export class SetValueEditActon extends EditAction {
  constructor(type: string, target: ISyntheticObject, public newValue: any) {
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

export abstract class BaseContentEdit<T extends ISyntheticObject> {

  private _actions: EditAction[];
  private _locked: boolean;

  constructor(readonly target: T) {
    this._actions = [];
  }

  /**
   * Lock the edit from any new modifications
   */

  public lock() {
    this._locked = true;
    return this;
  }

  get locked() {
    return this._locked;
  }

  get actions(): EditAction[] {
    return this._actions;
  }

  /**
   * Applies all edit actions against the target synthetic object.
   *
   * @param {(T & IEditable)} target the target to apply the edits to
   */

  public applyActionsTo(target: T & IEditable) {

    // need to setup an editor here since some actions may be intented for
    // children of the target object
    const editor = new SyntheticObjectEditor(target);
    editor.applyEditActions(...this.actions);
  }

  /**
   * creates a new diff edit -- note that diff edits can only contain diff
   * actions since any other action may foo with the diffing.
   *
   * @param {T} newSynthetic
   * @returns
   */

  public fromDiff(newSynthetic: T) {
    const ctor = this.constructor as { new(target:T): BaseContentEdit<T> };

    // TODO - shouldn't be instantiating the constructor property (it may require more params). Use clone method
    // instead.
    const clone = new ctor(this.target);
    return clone.addDiff(newSynthetic).lock();
  }

  protected abstract addDiff(newSynthetic: T): BaseContentEdit<T>;

  protected addAction<T extends EditAction>(action: T) {

    // locked to prevent other actions busting this edit.
    if (this._locked) {
      throw new Error(`Cannot modify a locked edit.`);
    }

    this._actions.push(action);

    // return the action so that it can be edited
    return action;
  }

  protected addChildEdit(edit: IContentEdit) {
    this._actions.push(...edit.actions);
    return this;
  }

}

@loggable()
export class FileEditor extends Observable {

  protected readonly logger: Logger;

  private _editing: boolean;
  private _editActions: EditAction[];
  private _shouldEditAgain: boolean;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor() {
    super();
  }

  applyEditActions(...actions: EditAction[]): Promise<any> {

    if (this._editActions == null) {
      this._shouldEditAgain = true;
      this._editActions = [];
    }

    this._editActions.push(...actions);
    this.run();

    return new Promise((resolve) => {
      const observer = new WrapBus((action: Action) => {
        if (action.type === FileEditorAction.DEPENDENCY_EDITED) {
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
      const actions = this._editActions;
      this._editActions = undefined;

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
        const contentEditorFactoryProvider = ContentEditorFactoryProvider.find(MimeTypeProvider.lookup(filePath, this._injector), this._injector);

        if (!contentEditorFactoryProvider) {
          console.error(`No synthetic edit consumer exists for ${filePath}.`);
          continue;
        }

        const fileCache     = await  FileCacheProvider.getInstance(this._injector).item(filePath);
        const oldContent    = await fileCache.read();
        const contentEditor = contentEditorFactoryProvider.create(filePath, oldContent);

        const actions = actionsByFilePath[filePath];
        this.logger.info("applying file edit actions %s: %s", filePath, actions.map(action => action.type).join(" "));

        const newContent    = contentEditor.applyEditActions(...actions);
        fileCache.setDataUrlContent(newContent);
        promises.push(fileCache.save());
      }

      await Promise.all(promises);

      // TODO - need to have rejection handling for various edits
      this._editing = false;
      this.notify(new FileEditorAction(FileEditorAction.DEPENDENCY_EDITED));

      // edits happened during getEditedContent call
      if (this._shouldEditAgain) {
        this.run();
      }
    }, 0);
  }
}

export class SyntheticObjectEditor {

  constructor(readonly root: ISyntheticObject) { }
  applyEditActions(...actions: EditAction[]) {

    const allSyntheticObjects = {};

    flattenTree(this.root).forEach((child) => {
      allSyntheticObjects[child.uid] = child;
    });

    for (let i = 0, n = actions.length; i < n; i++) {
      const action = actions[i];

      // Assuming that all edit actions being applied to synthetics are editable. Otherwise
      // they shouldn't be dispatched.
      const target = allSyntheticObjects[action.target.uid] as IEditable;

      if (!target) {
        throw new Error(`Edit action ${action.type} target ${action.target.uid} not found.`);
      }

      target.applyEditAction(action);
    }
  }
}