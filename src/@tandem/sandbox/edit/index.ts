import { flatten } from "lodash";
import { FileCache } from "../file-cache";
import { IDispatcher } from "@tandem/mesh";
import { CallbackDispatcher } from "@tandem/mesh";
import { IFileSystem } from "../file-system";
import { FileCacheProvider, ContentEditorFactoryProvider, ProtocolURLResolverProvider, FileSystemProvider } from "../providers";
import { ISyntheticObject, ISyntheticSourceInfo, syntheticSourceInfoEquals } from "../synthetic";
import {
  Action,
  inject,
  Logger,
  Injector,
  loggable,
  serialize,
  Observable,
  deserialize,
  flattenTree,
  serializable,
  ISerializable,
  getSerializeType,
  MimeTypeProvider,
  InjectorProvider,
  ISerializedContent,
} from "@tandem/common";

export type contentEditorType = { new(filePath: string, content: string): IEditor };


export interface IEditor {
  applyEditChanges(...changes: EditChange[]): any;
}

export interface IEditable {
  createEdit(): IContentEdit;
  applyEditChange(change: EditChange): any;
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
  applyEditChanges(...changes: EditChange[]): any {
    for (const action of changes) {
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
  serialize({ type, target }: EditChange) {
    return {
      type: type,
      target: serialize(target.clone())
    };
  },
  deserialize({ type, target }, injector): EditChange {
    return new EditChange(
      type,
      deserialize(target, injector)
    );
  }
})
export class EditChange extends Action {
  readonly target: ISyntheticObject;
  constructor(type: string, target: ISyntheticObject) {
    super(type);
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

export abstract class ApplicableEditChange extends EditChange {
  abstract applyTo(target: any);
}

export abstract class ChildEditChange extends ApplicableEditChange {
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
  serialize({ type, target, child, index }: InsertChildEditChange) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone(true)),
      index: index
    };
  },
  deserialize({ type, target, child, index }, injector): InsertChildEditChange {
    return new InsertChildEditChange(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      index
    );
  }
})
export class InsertChildEditChange extends ChildEditChange {
  constructor(type: string, target: ISyntheticObject, child: ISyntheticObjectChild, readonly index: number = Infinity) {
    super(type, target, child);
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
  serialize({ type, target, child }: RemoveChildEditChange) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone())
    };
  },
  deserialize({ type, target, child, newIndex }, injector): RemoveChildEditChange {
    return new RemoveChildEditChange(
      type,
      deserialize(target, injector),
      deserialize(child, injector)
    );
  }
})
export class RemoveChildEditChange extends ChildEditChange {
  constructor(type: string, target: ISyntheticObject, child: ISyntheticObjectChild) {
    super(type, target, child);
  }
  applyTo(collection: ISyntheticObjectChild[]) {
    const foundIndex = this.findChildIndex(collection);
    if (foundIndex === -1) throw new Error(`Cannot apply move edit - child ${this.child.uid} not found`);
    collection.splice(foundIndex, 1);
  }
}

@serializable({
  serialize({ type, target, child, newIndex }: MoveChildEditChange) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone()),
      newIndex: newIndex
    };
  },
  deserialize({ type, target, child, newIndex }, injector): MoveChildEditChange {
    return new MoveChildEditChange(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      newIndex
    );
  }
})
export class MoveChildEditChange extends ChildEditChange {
  constructor(type: string, target: ISyntheticObject, child: ISyntheticObjectChild, readonly newIndex: number) {
    super(type, target, child);
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
  serialize({ type, target, name, newValue, oldName, newIndex }: SetKeyValueEditChange) {
    return {
      type: type,
      target: serialize(target.clone()),
      name: name,
      newValue: serialize(newValue),
      oldName: oldName,
      newIndex: newIndex
    };
  },
  deserialize({ type, target, name, newValue, oldName, newIndex }, injector): SetKeyValueEditChange {
    return new SetKeyValueEditChange(
      type,
      deserialize(target, injector),
      name,
      deserialize(newValue, injector),
      oldName,
      newIndex
    );
  }
})
export class SetKeyValueEditChange extends ApplicableEditChange {
  constructor(type: string, target: ISyntheticObject, public  name: string, public newValue: any, public oldName?: string, public newIndex?: number) {
    super(type, target);
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
export class SetValueEditActon extends EditChange {
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

export class RemoveEditChange extends EditChange {
  static readonly REMOVE_EDIT = "removeEdit";
  constructor(target: ISyntheticObject) {
    super(RemoveEditChange.REMOVE_EDIT, target);
  }
}

export interface IContentEdit {
  readonly changes: EditChange[];
}

export abstract class BaseContentEdit<T extends ISyntheticObject> {

  private _changes: EditChange[];
  private _locked: boolean;

  constructor(readonly target: T) {
    this._changes = [];
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

  get changes(): EditChange[] {
    return this._changes;
  }

  /**
   * Applies all edit.changes against the target synthetic object.
   *
   * @param {(T & IEditable)} target the target to apply the edits to
   */

  public applyActionsTo(target: T & IEditable, each?: (T, action: EditChange) => void) {

    // need to setup an editor here since some actions may be intented for
    // children of the target object
    const editor = new SyntheticObjectEditor(target, each);
    editor.applyEditChanges(...this.changes);
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

  protected addChange<T extends EditChange>(action: T) {

    // locked to prevent other actions busting this edit.
    if (this._locked) {
      throw new Error(`Cannot modify a locked edit.`);
    }

    this._changes.push(action);

    // return the action so that it can be edited
    return action;
  }

  protected addChildEdit(edit: IContentEdit) {
    this._changes.push(...edit.changes);
    return this;
  }

}

@loggable()
export class FileEditor {

  protected readonly logger: Logger;

  private _editing: boolean;
  private _changes: EditChange[];
  private _shouldEditAgain: boolean;

  private _promise: Promise<any>;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  applyEditChanges(...changes: EditChange[]): Promise<any> {

    if (this._changes == null) {
      this._shouldEditAgain = true;
      this._changes = [];
    }

    this._changes.push(...changes);

    return this._promise || (this._promise = new Promise((resolve, reject) => {
      setImmediate(() => {
        let done = () => this._promise = undefined;
        this.run().then(resolve, reject).then(done, done);
      });
    }));
  }

  private async run(): Promise<any> {
    this._shouldEditAgain = false;
    const changes = this._changes;
    this._changes = undefined;

    const changesByFilePath = {};

    // find all actions that are part of the same file and
    // batch them together. Important to ensure that we do not trigger multiple
    // unecessary updates to any file listeners.
    for (const action of changes) {
      const target = action.target;

      // This may happen if edits are being applied to synthetic objects that
      // do not have the proper mappings
      if (!target.source || !target.source.filePath) {
        console.error(`Cannot edit file, source property is mising from ${target.clone(false).toString()}.`);
        continue;
      }

      const targetSource = target.source;

      const targetFilePath = await ProtocolURLResolverProvider.resolve(targetSource.filePath, this._injector);

      const filePathActions: EditChange[] = changesByFilePath[targetFilePath] || (changesByFilePath[targetFilePath] = []);
      filePathActions.push(action);
    }

    const promises = [];

    for (const filePath in changesByFilePath) {
      const contentEditorFactoryProvider = ContentEditorFactoryProvider.find(MimeTypeProvider.lookup(filePath, this._injector), this._injector);

      if (!contentEditorFactoryProvider) {
        console.error(`No synthetic edit consumer exists for ${filePath}.`);
        continue;
      }

      const autoSave   = contentEditorFactoryProvider.autoSave    ;
      const fileCache  = await  FileCacheProvider.getInstance(this._injector).item(filePath);
      const oldContent = String(await fileCache.read());

      // error may be thrown if the content is invalid
      try {
        const contentEditor = contentEditorFactoryProvider.create(filePath, oldContent);

        const changes = changesByFilePath[filePath];
        this.logger.info(`Applying file edit.changes ${filePath}: >>`, changes.map(action => action.type).join(" "));

        const newContent    = contentEditor.applyEditChanges(...changes);

        // This may trigger if the editor does special formatting to the content with no
        // actual edits. May need to have a result come from the content editors themselves to check if anything's changed.
        // Note that checking WS changes won't cut it since formatters may swap certain characters. E.g: HTML may change single quotes
        // to double quotes for attributes.
        if (oldContent !== newContent) {
          fileCache.setDataUrlContent(newContent);
          promises.push(fileCache.save());
          if (autoSave) {
            promises.push(this._fileSystem.writeFile(fileCache.filePath, newContent));
          }
        } else {
          this.logger.debug(`No changes to ${filePath}`);
        }
      } catch(e) {
        this.logger.error(`Error trying to apply ${changes.map(action => action.type).join(", ")} file edit to ${filePath}: ${e.stack}`);
      }
    }

    await Promise.all(promises);

    // edits happened during getEditedContent call
    if (this._shouldEditAgain) {
      this.run();
    }
  }
}

export class SyntheticObjectEditor {

  constructor(readonly root: ISyntheticObject, private _each?: (target: IEditable, change: EditChange) => void) { }
  applyEditChanges(...changes: EditChange[]) {

    const allSyntheticObjects = {};

    flattenTree(this.root).forEach((child) => {
      allSyntheticObjects[child.uid] = child;
    });

    for (let i = 0, n = changes.length; i < n; i++) {
      const change = changes[i];

      // Assuming that all edit.changes being applied to synthetics are editable. Otherwise
      // they shouldn't be dispatched.
      const target = allSyntheticObjects[change.target.uid] as IEditable;

      if (!target) {
        throw new Error(`Edit change ${change.type} target ${change.target.uid} not found.`);
      }

      try {
        target.applyEditChange(change);

        // each is useful particularly for debugging diff algorithms. See tests.
        if (this._each) this._each(target, change);
      } catch(e) {
        throw new Error(`Error trying to apply edit ${change.type} to ${change.target.toString()}: ${e.stack}`);
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
  private _targetObserver: IDispatcher<any, any>;
  private _diffing: boolean;
  private _shouldDiffAgain: boolean;
  private _ticking: boolean;

  constructor(private onChange: (changes: EditChange[]) => any, private onClone: (clone: T) => any, private filterAction?: (action: Action) => boolean) {
    this._targetObserver = new CallbackDispatcher(this.onTargetAction.bind(this));
  }

  get target() {
    return this._target;
  }

  set target(value: T) {
    this.dispose();
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

  private requestDiff() {
    if (this._ticking) return;
    this._ticking = true;
    setImmediate(this.diff.bind(this));
  }


  private async diff() {
    this._ticking = false;

    if (this._diffing) {
      this._shouldDiffAgain = true;
      return;
    }

    this._diffing = true;
    const edit = (<BaseContentEdit<any>>this._clone.createEdit()).fromDiff(this._target);
    if (edit.changes.length) {
      try {
        await this.onChange(edit.changes);
      } catch(e) {
        this._diffing = false;
        throw e;
      }
      edit.applyActionsTo(this._clone);
    }

    this._diffing = false;
    if (this._shouldDiffAgain) {
      this._shouldDiffAgain = false;
      this.diff();
    }
  }
}

export abstract class SyntheticObjectEdit<T extends ISyntheticObject> extends BaseContentEdit<T> {
  static readonly SET_SYNTHETIC_SOURCE_EDIT = "setSyntheticSourceEdit";

  setSource(source: ISyntheticSourceInfo) {
    this.addChange(new SetKeyValueEditChange(SyntheticObjectEdit.SET_SYNTHETIC_SOURCE_EDIT, this.target, "$source", source));
  }

  protected addDiff(from: T) {
    if (!syntheticSourceInfoEquals(this.target.$source, from.$source)) {
      this.setSource(from.$source);
    }
    return this;
  }
}
