import {
  TreeNode,
  DEFAULT_NAMESPACE,
  getAttribute,
  getChildParentMap,
  filterNestedNodes,
  getTreeNodeFromPath,
  findNestedNode,
  updateNestedNode,
  setNodeAttribute,
  createTreeNode,
  appendChildNode
} from "./tree";
import { memoize } from "../utils/memoization";
import * as path from "path";

export const FILE_TAG_NAME = "file";
export const DIRECTORY_TAG_NAME = "directory";

export type File = {
  name: "file";
} & TreeNode;

export type Directory = {
  name: "directory";
} & TreeNode;

export enum FileAttributeNames {
  URI = "uri",
  EXPANDED = "expanded",
  BASENAME = "basename",
  SELECTED = "selected"
}

export const isFile = (node: TreeNode) => node.name === FILE_TAG_NAME;
export const isDirectory = (node: TreeNode) => node.name === DIRECTORY_TAG_NAME;

export const getFileName = (node: TreeNode) => getAttribute(node, "name");

export const createFile = (name: string): File =>
  createTreeNode(FILE_TAG_NAME, {
    [DEFAULT_NAMESPACE]: {
      name
    }
  }) as File;

export const createDirectory = (
  uri: string,
  children: (File | Directory)[]
): Directory =>
  createTreeNode(DIRECTORY_TAG_NAME, {
    [DEFAULT_NAMESPACE]: {
      uri
    }
  }) as Directory;

export const getFilePath = memoize((file: File, directory: Directory) => {
  const childParentMap = getChildParentMap(directory);
  const path: string[] = [];

  let current: TreeNode = file;
  while (current) {
    path.unshift(getFileName(current));
    current = childParentMap[current.id];
  }

  return path.join("/");
});

export const getFilePathFromNodePath = (path: number[], directory: Directory) =>
  getFilePath(getTreeNodeFromPath(path, directory) as File, directory);

export const getFileFromUri = (uri: string, root: Directory) =>
  findNestedNode(
    root,
    child => getAttribute(child, FileAttributeNames.URI) === uri
  );

const getSelectedFile = memoize((root: Directory) =>
  findNestedNode(root, child =>
    getAttribute(child, FileAttributeNames.SELECTED)
  )
);

const getSelectedFiles = memoize((root: Directory) =>
  filterNestedNodes(root, child =>
    getAttribute(child, FileAttributeNames.SELECTED)
  )
);

export const getFilesWithExtension = memoize(
  (extension: string, directory: Directory) => {
    const tester = new RegExp(`${extension}$`);
    return filterNestedNodes(
      directory,
      file => isFile(file) && tester.test(getFileName(file))
    );
  }
);

export const convertFlatFilesToNested = (
  rootDir: string,
  files: string[]
): Directory => {
  const partedFiles = files.map(file => {
    return file.substr(rootDir.length).split("/");
  });

  let root: Directory = createTreeNode("directory", {
    [DEFAULT_NAMESPACE]: {
      [FileAttributeNames.URI]: "file://" + rootDir,
      [FileAttributeNames.BASENAME]: path.basename(rootDir)
    }
  }) as Directory;

  for (const pf of partedFiles) {
    let current: Directory = root;
    let prev: Directory;
    let i = 0;
    for (let n = pf.length; i < n - 1; i++) {
      const part = pf[i];
      prev = current;
      current = current.children.find(
        child => child.attributes[DEFAULT_NAMESPACE].basename === part
      ) as Directory;
      if (!current) {
        current = createTreeNode("directory", {
          [DEFAULT_NAMESPACE]: {
            [FileAttributeNames.URI]:
              "file://" +
              path.join(rootDir, pf.slice(0, i + 1).join("/")) +
              "/",
            [FileAttributeNames.BASENAME]: part
          }
        }) as Directory;

        prev.children.push(current, prev);
      }
    }

    const isFile = /\./.test(pf[i]);

    current.children.push(
      createTreeNode(isFile ? "file" : "directory", {
        [DEFAULT_NAMESPACE]: {
          [FileAttributeNames.URI]:
            "file://" + path.join(rootDir, pf.join("/")) + (isFile ? "" : "/"),
          [FileAttributeNames.BASENAME]: pf[i]
        }
      })
    );
  }

  return root;
};
