import * as fs from "fs";
import * as chokidar from "chokidar";
import { IDisposable } from "@tandem/common";
import { BaseFileSystem } from "./base";

export class LocalFileSystem extends BaseFileSystem {

  async readFile(filePath: string) {
    this.logger.verbose("read %s", filePath);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
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
      interval: 1000,
      usePolling: false,
    });

    watcher.on("change", () => {
      onChange();
    });

    return {
      dispose: () => {
        watcher.close()
      }
    }
  }
}