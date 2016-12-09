// import {
//   inject,
//   Logger,
//   loggable,
//   IDisposable,
//   PrivateBusProvider,
// } from "@tandem/common";

// import {
//   ReadFileRequest,
//   WatchFileRequest,
// } from "../messages";

// import { ReadableStream } from "@tandem/mesh";

// export interface IFileWatcher extends IDisposable { }

// export interface IReadFileResultItem {
//   name: string;
//   isDirectory: boolean;
// }

// export interface IFileSystem {
//   readDirectory(directoryPath: string): ReadableStream<IReadFileResultItem[]>
//   readFile(filePath: string): Promise<any>;
//   fileExists(filePath: string): Promise<boolean>;
//   writeFile(filePath: string, content: any): Promise<any>;
//   watchFile(filePath: string, onChange: () => any): IFileWatcher;
// }

// @loggable()
// export abstract class BaseFileSystem implements IFileSystem {

//   protected readonly logger: Logger;

//   private _fileWatchers: any;

//   constructor() {
//     this._fileWatchers = {};
//   }

//   abstract readFile(filePath: string): Promise<any>;
//   abstract readDirectory(directoryPath: string): ReadableStream<IReadFileResultItem[]>;
//   abstract fileExists(filePath: string): Promise<boolean>;
//   abstract writeFile(filePath: string, content: any): Promise<any>;

//   public watchFile(filePath: string, onChange: () => any) {

//     let _fileWatcher: { instance: IFileWatcher, listeners: Function[] };

//     if (!(_fileWatcher = this._fileWatchers[filePath])) {
//       _fileWatcher = this._fileWatchers[filePath] = {
//         listeners: [],
//         instance: this.watchFile2(filePath, () => {
//           for (let i = _fileWatcher.listeners.length; i--;) {
//             _fileWatcher.listeners[i]();
//           }
//         })
//       }
//     }

//     const { listeners, instance } = _fileWatcher;

//     listeners.push(onChange);

//     return {
//       dispose: () => {
//         const index = listeners.indexOf(onChange);
//         if (index === -1) return;
//         listeners.splice(index, 1);
//         if (listeners.length === 0) {
//           instance.dispose();
//         }
//       }
//     }
//   }

//   protected abstract watchFile2(filePath: string, onChange: () => any);
// }