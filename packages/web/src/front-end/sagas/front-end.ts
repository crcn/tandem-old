import { FrontEndOptions } from "tandem-front-end";

export function* createFrontEndSideEffects(): IterableIterator<
  FrontEndOptions
> {
  return {
    readFile,
    writeFile,
    openPreview,
    loadProjectInfo,
    readDirectory,
    openContextMenu,
    deleteFile,
    openFile
  };
}

function* readFile() {}

function* writeFile() {}

function* openPreview() {}

function* loadProjectInfo() {
  console.log("LOAD PROJECT");
}

function* readDirectory() {}

function* openContextMenu() {}

function* deleteFile() {}

function* openFile() {}
