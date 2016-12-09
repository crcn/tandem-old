import { inject, IDisposable, loggable, Logger } from "@tandem/common"; 
import { IFileSystem } from "../file-system";
import { FileSystemProvider } from "../providers";


@loggable()
export abstract class URLProtocol {
  protected readonly logger: Logger;

  abstract read(url: string): Promise<string|Buffer>;
  abstract write(url: string, content: any): Promise<any>;
  abstract watch(url: string, onChange: () => any): IDisposable;

  protected removeProtocol(url: string) {
    return url.replace(/^\w+:\/\//, "");
  }
}

export class FileURLProtocol extends URLProtocol {

  @inject(FileSystemProvider.ID)
  private _fs: IFileSystem;
  
  read(url: string): Promise<string> {
    return this._fs.readFile(this.removeProtocol(url));
  }

  watch(url: string, onChange: () => any): IDisposable {
    return this._fs.watchFile(this.removeProtocol(url), onChange);
  }

  write(url: string, content: any): Promise<any> {
    return this._fs.writeFile(url, content);
  }
}

export class HTTPURLProtocol extends URLProtocol {
  async read(url: string): Promise<string> {
    return (await fetch(url)).text();
  }
  async write(url: string, content: string) {
    this.logger.info(`Cannot currenty write to urls`);
  }
  watch(url: string, onChange: () => any) {
    this.logger.info(`Cannot currently watch urls`);

    return {
      dispose() { }
    }
  }
}