import * as path from "path";
import { FileSystemProvider, IFileSystem } from "@tandem/sandbox";
import {
  inject,
  bindable,
  IInjectable,
  Injector,
  InjectorProvider,
  bubble,
  ObservableCollection,
  TreeNode,
  BubbleDispatcher
} from "@tandem/common";

export class BaseFSModel extends TreeNode<BaseFSModel> {

  @inject(FileSystemProvider.ID)
  protected _fileSystem: IFileSystem;

  @inject(InjectorProvider.ID)
  protected _injector: Injector;

  constructor(readonly path: string) {
    super();
  }

  get name() {
    return path.basename(this.path);
  }

  onChildAdded(child: BaseFSModel) {
    super.onChildAdded(child);
    if (this._injector) this._injector.inject(child);
    child.observe(new BubbleDispatcher(this));
  }
}

export class FileModel extends BaseFSModel {

}

export class DirectoryModel extends BaseFSModel {

  async load() {

    this.removeAllChildren();
    for (const { name, isDirectory } of await this._fileSystem.readDirectory(this.path)) {
      if (name.charAt(0) === ".") continue;
      const filePath = path.join(this.path, name);
      this.appendChild(isDirectory ? new DirectoryModel(filePath) : new FileModel(filePath));
    }
  }
}