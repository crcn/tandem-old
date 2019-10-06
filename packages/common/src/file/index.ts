import { Provider, Kernel, BaseInstanceProvider, providerGetter } from "../ioc";
import { readFile, writeFile, readdir, unlink, statSync } from "fs";
import { join, extname } from "path";
import * as mime from "mime-types";

export type DirectoryItem = {
  path: string;
  isDirectory: boolean;
};

export interface FileAdapter {
  readFile(path: string): Promise<{ content: Buffer; mimeType: string }>;
  writeFile(path: string, data: Buffer): Promise<void>;
  readDirectory(path: string): Promise<DirectoryItem[]>;
  removeFile(path: string): Promise<void>;
}

export abstract class FileAdapterProvider extends BaseInstanceProvider<
  FileAdapter
> {
  static readonly ID = "FILE_IO_PROVIDER";
  constructor(createFileAdapter: (kernel: Kernel) => FileAdapter) {
    super(FileAdapterProvider.ID, createFileAdapter);
  }
  static getProvider = providerGetter<FileAdapterProvider>(
    FileAdapterProvider.ID
  );
}

export class NativeFileAdapter implements FileAdapter {
  constructor(private _kernel: Kernel) {}
  readFile(path) {
    return new Promise<{ content: Buffer; mimeType: string }>(
      (resolve, reject) => {
        readFile(path, (err, content) => {
          if (err) return reject(err);
          resolve({
            content,
            mimeType: MimeTypeProvider.getProvider(this._kernel).lookup(path)
          });
        });
      }
    );
  }
  writeFile(path: string, buffer: Buffer) {
    return new Promise<void>((resolve, reject) => {
      writeFile(path, buffer, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  readDirectory(fullPath: string) {
    return new Promise<DirectoryItem[]>((resolve, reject) => {
      readdir(fullPath, (err, basenames) => {
        if (err) return reject(err);
        resolve(
          basenames.map(basename => {
            const filePath = join(fullPath, basename);
            return {
              path: filePath,
              isDirectory: statSync(filePath).isDirectory()
            };
          })
        );
      });
    });
  }
  removeFile(path: string) {
    return new Promise<void>((resolve, reject) => {
      unlink(path, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
export class NativeFileAdapterProvider extends FileAdapterProvider {
  constructor() {
    super(kernel => new NativeFileAdapter(kernel));
  }
}

export class MimeTypeProvider implements Provider {
  static readonly ID = "MIME_TYPES";
  readonly id = MimeTypeProvider.ID;
  private _extMap = {};
  addAliases(type: string, extensions: string[]) {
    for (const ext of extensions) {
      this._extMap[ext] = type;
    }
  }
  lookup(path: string) {
    return this._extMap[extname(path)] || mime.lookup(path);
  }
  initialize() {}
  static getProvider = providerGetter<MimeTypeProvider>(MimeTypeProvider.ID);
  static createRegistry() {
    return {
      [MimeTypeProvider.ID]: new MimeTypeProvider()
    };
  }
}
