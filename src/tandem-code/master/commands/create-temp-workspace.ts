import * as path from "path";
import { BaseStudioMasterCommand } from "./base";
import { MimeTypeProvider, inject } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { CreateTemporaryWorkspaceRequest } from "tandem-code/common";
import { FileCacheProvider, FileCache, IFileSystem, FileSystemProvider } from "@tandem/sandbox"; 

let i = 0;

export class CreateTempWorkspaceCommand extends BaseStudioMasterCommand {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  @inject(FileSystemProvider.ID)
  private _fs: IFileSystem;
  
  async execute({ uri }: CreateTemporaryWorkspaceRequest) {

    // temp name must share the same path as the file to ensure that all relative assets
    // are loaded in.
    const tmpName = path.join(path.dirname(uri), `unsaved${i++}.workspace`);

    let content;

    if (MimeTypeProvider.lookup(uri, this.injector) === TDPROJECT_MIME_TYPE) {
      content = await this._fs.readFile(uri);
    } else {
      content = `<tandem>
        <artboard src="${uri} />
      </tandem>`;
    }

    await this._fileCache.add(tmpName, content);

    
    return 'cache://' + tmpName;
  }
} 