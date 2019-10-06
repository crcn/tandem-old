import { RootState } from "../../..";

import { setup } from "../../..";
import { StubDirectory, getFSItem, StubFSType, StubFile } from "../stubs/index";
import { ProjectInfo } from "../../../state";
import { stripProtocol } from "tandem-common";
import * as mime from "mime-types";

export type MockAppOptions = {
  rootDirectory: StubDirectory;
  initialState: RootState;
};

console.log(new Buffer("abc").toString("utf8"));

export const setupMockApp = ({
  rootDirectory,
  initialState
}: MockAppOptions) => {
  // in case any writing happens
  const cloneDirectory: StubDirectory = rootDirectory;

  function readFile(uri) {
    const path = stripProtocol(uri);

    const item = getFSItem(path, cloneDirectory) as StubFile;

    return Promise.resolve({
      content: item.content,
      mimeType: mime.lookup(uri) || null
    });
  }

  function* writeFile() {}

  function* openPreview() {}

  function* loadProjectInfo() {
    const info: ProjectInfo = {
      config: {
        exclude: []
      },
      path: "/"
    };
    return info;
  }

  function* readDirectory(uri) {
    const path = stripProtocol(uri);
    const dir = getFSItem(path, cloneDirectory) as StubDirectory;

    return dir.children.map(child => ({
      isDirectory: child.type === StubFSType.DIRECTORY,
      basename: child.name
    }));
  }

  function* openContextMenu() {}

  function* deleteFile() {}

  function* openFile() {
    console.log("OPEN FILEEE", arguments);
  }

  return setup(function*() {
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
  })(initialState);
};
