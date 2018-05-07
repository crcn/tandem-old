import { TreeNode, DEFAULT_NAMESPACE, getAttribute, getChildParentMap, filterNestedNodes, getTreeNodeFromPath, findNestedNode } from "./tree";
import { memoize } from "../utils/memoization";
import * as path from "path";

export const FILE_TAG_NAME = "file";
export const DIRECTORY_TAG_NAME = "directory";

export type File = {
  name: "file"
} & TreeNode;

export type Directory = {
  name: "directory"
} & TreeNode;

export enum FileAttributeNames {
  URI = "uri",
  EXPANDED = "expanded",
  BASENAME = "basename"
};

export const isFile = (node: TreeNode) => node.name === FILE_TAG_NAME;
export const isDirectory = (node: TreeNode) => node.name === DIRECTORY_TAG_NAME;

export const getFileName = (node: TreeNode) => getAttribute(node, "name");

export const createFile = (name: string): File => ({
  name: FILE_TAG_NAME,
  children: [],
  attributes: {
    [DEFAULT_NAMESPACE]: {
      name
    }
  }
});

export const createDirectory = (uri: string, children: (File|Directory)[]): Directory => ({
  name: DIRECTORY_TAG_NAME,
  children,
  attributes: {
    [DEFAULT_NAMESPACE]: {
      uri
    }
  }
});

export const getFilePath = memoize((file: File, directory: Directory) => {
  const childParentMap = getChildParentMap(directory);
  const path: string[] = [];

  let current: TreeNode = file;
  while(current) {
    path.unshift(getFileName(current));
    current = childParentMap[current.id];
  }

  return path.join("/");
});

export const getFilePathFromNodePath = (path: number[], directory: Directory) => getFilePath(getTreeNodeFromPath(path, directory) as File, directory);

export const getFileFromUri = (uri: string, root: Directory) => findNestedNode(root, (child) => getAttribute(child, FileAttributeNames.URI) === uri);

export const getFilesWithExtension = memoize((extension: string, directory: Directory) => {
  const tester = new RegExp(`${extension}$`);
  return filterNestedNodes(directory, file => isFile(file) && tester.test(getFileName(file)));
});

export const convertFlatFilesToNested = (uri: string, files: string[]): Directory => {
  const partedFiles = files.map(file => {
    return file.substr(uri.length).split("/")
  });

  let root: Directory = {
    name: "directory",
    attributes: {
      [DEFAULT_NAMESPACE]: {
        [FileAttributeNames.URI]: uri,
        [FileAttributeNames.BASENAME]: path.basename(uri)
      }
    },
    children: []
  };

  for (const pf of partedFiles) {
    let current: Directory = root;
    let prev: Directory;
    let i = 0;
    for (let n = pf.length; i < n - 1; i++) {
      const part = pf[i];
      prev = current;
      current = current.children.find(child => child.attributes[DEFAULT_NAMESPACE].basename === part) as Directory;
      if (!current) {
        current = {
          name: "directory",
          attributes: {
            [DEFAULT_NAMESPACE]: {
              [FileAttributeNames.BASENAME]: part
            }
          },
          children: []
        };

        prev.children.push(current);
      }
    }

    current.children.push({
      name: "file",
      attributes: {
        [DEFAULT_NAMESPACE]: {
          [FileAttributeNames.URI]: "file://" + path.join(uri, pf.join("/")),
          [FileAttributeNames.BASENAME]: pf[i],
        }
      },
      children: []
    })
  }

  return root;
};