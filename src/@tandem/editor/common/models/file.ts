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
  BubbleBus
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
    this._injector.inject(child);
    child.observe(new BubbleBus(this));
  }
}

export class File extends BaseFSModel {

}

export class Directory extends BaseFSModel {

  async load() {

    this.removeAllChildren();
    for (const { name, isDirectory } of await this._fileSystem.readDirectory(this.path)) {
      const filePath = path.join(this.path, name);
      this.appendChild(isDirectory ? new Directory(filePath) : new File(filePath));
    }
  }
}