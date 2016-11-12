import * as fs from "fs";
import * as chokidar from "chokidar";
import { IDisposable } from "@tandem/common";
import { BaseFileSystem, IReadFileResultItem } from "./base";

export class LocalFileSystem extends BaseFileSystem {

  async readDirectory(directoryPath: string): Promise<IReadFileResultItem[]> {
    return new Promise<IReadFileResultItem[]>((resolve, reject) => {
      fs.readdir(directoryPath, (err, result) => {
        if (err) return reject(err);
        resolve(result.map(name => ({
          name: name,
          isDirectory: fs.lstatSync(directoryPath + "/" + name).isDirectory()
        })).sort((a, b) => {
          // sort by directory & file name
          return a.isDirectory && !b.isDirectory ? -1 : a.isDirectory === b.isDirectory ? a > b ? 1 : -1 : 1;
        }));
      });
    });
  }

  async readFile(filePath: string) {
    this.logger.verbose("read %s", filePath);
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
      resolve();
    });
  }

  watchFile2(filePath: string, onChange: () => any) {
    this.logger.verbose("watch %s", filePath);
    const watcher = chokidar.watch(filePath, {
      usePolling: false
    });

    let currentStat = fs.lstatSync(filePath);

    watcher.on("change", () => {
      let newStat = fs.lstatSync(filePath);
      if (newStat.mtime.getTime() === currentStat.mtime.getTime()) return;
      currentStat = newStat;
      onChange();
    });

    return {
      dispose: () => {
        watcher.close()
      }
    }
  }
}