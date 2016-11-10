import { flatten } from "lodash";
import { WrapBus } from "mesh";
import { debounce } from "lodash";
import { FileCache } from "../file-cache";
import { FileEditorAction } from "../actions";
import { FileCacheProvider, ContentEditorFactoryProvider, ProtocolURLResolverProvider } from "../providers";
import { ISyntheticObject, ISyntheticSourceInfo, syntheticSourceInfoEquals } from "../synthetic";
import {
  Action,
  inject,
  serialize,
  IActor,
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

@loggable()
export abstract class BaseContentEditor<T> implements IEditor {

  readonly logger: Logger;

  protected _rootASTNode: T;

  constructor(readonly fileName: string, readonly content: string) { }

  $didInject() {
    this._rootASTNode = this.parseContent(this.content);
  }

  // add filePath and content in constructor here instead
  applyEditActions(...actions: EditAction[]): any {
    for (const action of actions) {
      const method = this[action.type];
      if (method) {
        const targetASTNode = this.findTargetASTNode(this._rootASTNode, action.target);
        if (targetASTNode) {
          method.call(this, targetASTNode, action);
        } else {
          this.logger.error(`Cannot apply edit ${action.type} on ${this.fileName}: AST node for synthetic object not found.`);
        }
      } else {
        this.logger.warn(`Cannot apply edit ${action.type} on ${this.fileName}.`);
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
  toString() {
    return `${this.constructor.name}(${this.paramsToString()})`;
  }
  protected paramsToString() {

    // Target is omitted here since you can inspect the *actual* target by providing an "each" function
    // for the synthetic object editor, and logging the target object there.
    return `${this.type}`;
  }
}

export interface ISyntheticObjectChild {
  uid: string;
  clone(deep?: boolean);
}

export abstract class ApplicableEditAction extends EditAction {
  abstract applyTo(target: any);
}

export abstract class ChildEditAction extends ApplicableEditAction {
  constructor(type: string, target: ISyntheticObject, readonly child: ISyntheticObjectChild) {
    super(type, target);
  }
  findChildIndex(collection: ISyntheticObjectChild[]) {
    const index = collection.findIndex(child => child.uid === this.child.uid);
    if (index === -1) throw new Error(`Cannot apply ${this.type} edit - child ${this.child.uid} not found.`);
    return index;
  }
  findChild(collection: ISyntheticObjectChild[]) {
    return collection[this.findChildIndex(collection)];
  }
  abstract applyTo(collection: ISyntheticObjectChild[]);
  paramsToString() {
    return `${super.paramsToString()}, ${this.child.toString().replace(/[\n\r\s\t]+/g, " ")}`;
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
export class InsertChildEditAction extends ChildEditAction {
  constructor(actionType: string, target: ISyntheticObject, child: ISyntheticObjectChild, readonly index: number = Infinity) {
    super(actionType, target, child);
  }
  applyTo(collection: ISyntheticObjectChild[]) {

    // need to clone child in case the edit is applied to multiple targets
    collection.splice(this.index, 0, this.child.clone(true));
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.index}`;
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
export class RemoveChildEditAction extends ChildEditAction {
  constructor(actionType: string, target: ISyntheticObject, child: ISyntheticObjectChild) {
    super(actionType, target, child);
  }
  applyTo(collection: ISyntheticObjectChild[]) {
    const foundIndex = this.findChildIndex(collection);
    if (foundIndex === -1) throw new Error(`Cannot apply move edit - child ${this.child.uid} not found`);
    collection.splice(foundIndex, 1);
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
export class MoveChildEditAction extends ChildEditAction {
  constructor(actionType: string, target: ISyntheticObject, child: ISyntheticObjectChild, readonly newIndex: number) {
    super(actionType, target, child);
  }

  applyTo(collection: ISyntheticObjectChild[]) {
    const found = this.findChild(collection);
    collection.splice(collection.indexOf(found), 1);
    collection.splice(this.newIndex, 0, found);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.newIndex}`;
  }
}

@serializable({
  serialize({ type, target, name, newValue, oldName, newIndex }: SetKeyValueEditAction) {
    return {
      type: type,
      target: serialize(target.clone()),
      name: name,
      newValue: serialize(newValue),
      oldName: oldName,
      newIndex: newIndex
    };
  },
  deserialize({ type, target, name, newValue, oldName, newIndex }, injector): SetKeyValueEditAction {
    return new SetKeyValueEditAction(
      type,
      deserialize(target, injector),
      name,
      deserialize(newValue, injector),
      oldName,
      newIndex
    );
  }
})
export class SetKeyValueEditAction extends ApplicableEditAction {
  constructor(actionType: string, target: ISyntheticObject, public  name: string, public newValue: any, public oldName?: string, public newIndex?: number) {
    super(actionType, target);
  }
  applyTo(target: ISyntheticObject) {
    target[this.name] = this.newValue;
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.name}, ${this.newValue}`;
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
  paramsToString() {
    return `${super.paramsToString()}, ${this.newValue}`;
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

  public applyActionsTo(target: T & IEditable, each?: (T, action: EditAction) => void) {

    // need to setup an editor here since some actions may be intented for
    // children of the target object
    const editor = new SyntheticObjectEditor(target, each);
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
      // batch them together. Important to ensure that we do not trigger multiple
      // unecessary updates to any file listeners.
      for (const action of actions) {
        const target = action.target;

        // This may happen if edits are being applied to synthetic objects that
        // do not have the proper mappings
        if (!target.source || !target.source.filePath) {
          console.error(`Cannot edit file, source property is mising from ${target.clone(false).toString()}.`);
          continue;
        }

        const targetSource = target.source;

        const targetFilePath = await ProtocolURLResolverProvider.resolve(targetSource.filePath, this._injector);

        const filePathActions: EditAction[] = actionsByFilePath[targetFilePath] || (actionsByFilePath[targetFilePath] = []);
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
        const oldContent    = String(await fileCache.read());

        // error may be thrown if the content is invalid
        try {
          const contentEditor = contentEditorFactoryProvider.create(filePath, oldContent);

          const actions = actionsByFilePath[filePath];
          this.logger.info("Applying file edit actions %s: >>%s", filePath, actions.map(action => action.type).join(" "));

          const newContent    = contentEditor.applyEditActions(...actions);

          // This may trigger if the editor does special formatting to the content with no
          // actual edits. May need to have a result come from the content editors themselves to check if anything's changed.
          // Note that checking WS changes won't cut it since formatters may swap certain characters. E.g: HTML may change single quotes
          // to double quotes for attributes.
          if (oldContent !== newContent) {
            fileCache.setDataUrlContent(newContent);
            promises.push(fileCache.save());
          } else {
            this.logger.verbose(`No changes to ${filePath}`);
          }
        } catch(e) {
          this.logger.error(`Error trying to apply ${actions.map(action => action.type).join(", ")} file edit to ${filePath}: ${e.stack}`);
        }

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

  constructor(readonly root: ISyntheticObject, private _each?: (target: IEditable, action: EditAction) => void) { }
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

      try {
        target.applyEditAction(action);

        // each is useful particularly for debugging diff algorithms. See tests.
        if (this._each) this._each(target, action);
      } catch(e) {
        throw new Error(`Error trying to apply edit ${action.type} to ${action.target.toString()}: ${e.stack}`);
      }
    }
  }
}

/**
 * Watches synthetic objects, and emits changes over time.
 */

export class SyntheticObjectChangeWatcher<T extends ISyntheticObject & IEditable & Observable> {

  private _clone: T;
  private _target: T
  private _targetObserver: IActor;

  constructor(private onChange: (actions: EditAction[]) => any, private onClone: (clone: T) => any, private filterAction?: (action: Action) => boolean) {
    this._targetObserver = new WrapBus(this.onTargetAction.bind(this));
  }

  get target() {
    return this._target;
  }

  set target(value: T) {
    if (this._target) {
      this._target.unobserve(this._targetObserver);
    }
    this._target = value;
    if (!this._clone) {
      this._clone  = value.clone(true) as T;
      this.onClone(this._clone);
    } else {
      this.diff();
    }

    if (this._target) {
      this._target.observe(this._targetObserver);
    }
  }

  dispose() {
    if (this._target) {
      this._target.unobserve(this._targetObserver);
    }
  }

  private onTargetAction(action: Action) {

    if (!this.filterAction || this.filterAction(action)) {

      // debounce to batch multiple operations together
      this.requestDiff();
    }
  }

  private requestDiff = debounce(() => {
    this.diff();
  }, 10);

  private diff() {
    const edit = (<BaseContentEdit<any>>this._clone.createEdit()).fromDiff(this._target);
    if (edit.actions.length) {
      this.onChange(edit.actions);
      edit.applyActionsTo(this._clone);
    }
  }
}

export abstract class SyntheticObjectEdit<T extends ISyntheticObject> extends BaseContentEdit<T> {
  static readonly SET_SYNTHETIC_SOURCE_EDIT = "setSyntheticSourceEdit";

  setSource(source: ISyntheticSourceInfo) {
    this.addAction(new SetKeyValueEditAction(SyntheticObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, this.target, "$source", source));
  }

  protected addDiff(from: T) {
    if (!syntheticSourceInfoEquals(this.target.$source, from.$source)) {
      this.setSource(from.$source);
    }
    return this;
  }
}
