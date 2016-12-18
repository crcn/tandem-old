// import path =  require("path");
// import { FileSystemProvider, IFileSystem } from "@tandem/sandbox";
// import {
//   inject,
//   bubble,
//   bindable,
//   Kernel,
//   TreeNode,
//   IInjectable,
//   BubbleDispatcher,
//   KernelProvider,
//   ObservableCollection,
// } from "@tandem/common";
// import { WritableStream } from "@tandem/mesh";

// export class BaseFSModel extends TreeNode<BaseFSModel> {

//   @inject(FileSystemProvider.ID)
//   protected _fileSystem: IFileSystem;

//   @inject(KernelProvider.ID)
//   protected _kernel: Kernel;

//   constructor(readonly path: string) {
//     super();
//   }

//   get name() {
//     return path.basename(this.path);
//   }

//   onChildAdded(child: BaseFSModel, index: number) {
//     super.onChildAdded(child, index);
//     if (this._kernel) this._kernel.inject(child);
//     child.observe(new BubbleDispatcher(this));
//   }
// }

// export class FileModel extends BaseFSModel {

// }

// export class DirectoryModel extends BaseFSModel {

//   async load() {
//     this.removeAllChildren();
//     this._fileSystem.readDirectory(this.path).pipeTo(new WritableStream({
//       write: ({ name, isDirectory }) => {
//       if (name.charAt(0) === ".") return;
//       const uri = path.join(this.path, name);
//       this.appendChild(isDirectory ? new DirectoryModel(uri) : new FileModel(uri));
//       }
//     }));
//   }
// }