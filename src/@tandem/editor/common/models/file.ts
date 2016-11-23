import * as path from "path";
import { FileSystemProvider, IFileSystem } from "@tandem/sandbox";
import {
  inject,
  bubble,
  bindable,
  Injector,
  TreeNode,
  IInjectable,
  BubbleDispatcher,
  InjectorProvider,
  ObservableCollection,
} from "@tandem/common";
import { WritableStream } from "@tandem/mesh";

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

  onChildAdded(child: BaseFSModel, index: number) {
    super.onChildAdded(child, index);
    if (this._injector) this._injector.inject(child);
    child.observe(new BubbleDispatcher(this));
  }
}

export class FileModel extends BaseFSModel {

}

export class DirectoryModel extends BaseFSModel {

  async load() {
    this.removeAllChildren();
    this._fileSystem.readDirectory(this.path).pipeTo(new WritableStream({
      write: ({ name, isDirectory }) => {
      if (name.charAt(0) === ".") return;
      const filePath = path.join(this.path, name);
      this.appendChild(isDirectory ? new DirectoryModel(filePath) : new FileModel(filePath));
      }
    }));
  }
}