import fs =  require("fs");
import { IDisposable } from "@tandem/common";
import { ReadableStream } from "@tandem/mesh";
import { BaseFileSystem, IReadFileResultItem } from "./base";

let _i = 0;

export class LocalFileSystem extends BaseFileSystem {

  readDirectory(directoryPath: string): ReadableStream<IReadFileResultItem[]> {
    return new ReadableStream({
      start(controller) {
        fs.readdir(directoryPath, (err, result) => {
          if (err) return controller.error(err);
          result.map(name => ({
            name: name,
            isDirectory: fs.lstatSync(directoryPath + "/" + name).isDirectory()
          })).sort((a, b) => {
            return a.isDirectory && !b.isDirectory ? -1 : a.isDirectory === b.isDirectory ? a.name > b.name ? 1 : -1 : 1;
          }).forEach((file) => {
            controller.enqueue(file);
          });
          controller.close();
        });
      }
    });
  }

  async readFile(filePath: string) {
    this.logger.debug("read", filePath);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  fileExists(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.exists(filePath, resolve);
    });
  }

  async writeFile(filePath: string, content: any) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  watchFile2(filePath: string, onChange: () => any) {
    this.logger.debug("watch", filePath);
    let currentStat = fs.lstatSync(filePath);
    const listener = () => {
      let newStat = fs.lstatSync(filePath);
      if (newStat.mtime.getTime() === currentStat.mtime.getTime()) return;
      currentStat = newStat;
      onChange();
    }

    fs.watchFile(filePath, { interval: 200 }, listener);

    return {
      dispose: () => {
        fs.unwatchFile(filePath, listener);
      }
    }
  }
}