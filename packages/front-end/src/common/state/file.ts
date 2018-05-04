import { TreeNode, DEFAULT_NAMESPACE, getAttribute, getChildParentMap, filterNestedNodes, getTreeNodeFromPath } from "./tree";
import { memoize } from "../utils/memoization";

export const FILE_TAG_NAME = "file";
export const DIRECTORY_TAG_NAME = "directory";

export type File = {
  name: "file"
} & TreeNode;

export type Directory = {
  name: "directory"
} & TreeNode;

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

export const getFilesWithExtension = memoize((extension: string, directory: Directory) => {
  const tester = new RegExp(`${extension}$`);
  return filterNestedNodes(directory, file => isFile(file) && tester.test(getFileName(file)));
});
