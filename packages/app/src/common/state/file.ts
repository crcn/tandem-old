import { TreeNode, DEFAULT_NAMESPACE, getAttribute } from "./tree";

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

export const getFileUri = (node: TreeNode) => getAttribute(node, "uri");

export const createFile = (uri: string): File => ({
  name: FILE_TAG_NAME,
  children: [],
  attributes: {
    [DEFAULT_NAMESPACE]: {
      uri
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
})