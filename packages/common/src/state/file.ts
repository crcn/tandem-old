import {
  TreeNode,
  getChildParentMap,
  filterNestedNodes,
  getTreeNodeFromPath,
  findNestedNode,
  updateNestedNode,
  createTreeNode,
  appendChildNode
} from "./tree";
import { memoize } from "../utils/memoization";
import * as path from "path";
import { generateUID } from "../utils/uid";

export enum FSItemNamespaces {
  CORE = "core"
}

export enum FSItemTagNames {
  FILE = "file",
  DIRECTORY = "directory"
}

type BaseFSItem<TName extends string> = {
  uri: string;
  expanded?: boolean;
  selected?: boolean;
} & TreeNode<TName>;

export type File = BaseFSItem<FSItemTagNames.FILE>;

export type Directory = BaseFSItem<FSItemTagNames.DIRECTORY>;

export enum FileAttributeNames {
  URI = "uri",
  EXPANDED = "expanded",
  BASENAME = "basename",
  SELECTED = "selected"
}

export type FSItem = File | Directory;

export const isFile = (node: TreeNode<any>) =>
  node.name === FSItemTagNames.FILE;
export const isDirectory = (node: TreeNode<any>) =>
  node.name === FSItemTagNames.DIRECTORY;

export const createFile = (uri: string): File => ({
  id: generateUID(),
  name: FSItemTagNames.FILE,
  uri,
  children: []
});

export const createDirectory = (uri: string): Directory => ({
  id: generateUID(),
  name: FSItemTagNames.DIRECTORY,
  uri,
  children: []
});

const getFileName = (current: FSItem) => path.basename(current.uri);

export const getFilePath = memoize((file: File, directory: Directory) => {
  const childParentMap = getChildParentMap(directory);
  const path: string[] = [];

  let current: FSItem = file;
  while (current) {
    path.unshift(getFileName(current));
    current = childParentMap[current.id] as FSItem;
  }

  return path.join("/");
});

export const getFilePathFromNodePath = (path: number[], directory: Directory) =>
  getFilePath(getTreeNodeFromPath(path, directory) as File, directory);

export const getFileFromUri = (uri: string, root: Directory) =>
  findNestedNode(root, child => child.uri === uri);

export const getFilesWithExtension = memoize(
  (extension: string, directory: Directory) => {
    const tester = new RegExp(`${extension}$`);
    return filterNestedNodes(
      directory,
      file => isFile(file) && tester.test(getFileName(file))
    );
  }
);

// export const convertFlatFilesToNested = (
//   rootDir: string,
//   files: string[]
// ): Directory => {
//   const partedFiles = files.map(file => {
//     return file.substr(rootDir.length).split("/");
//   });

//   let root: Directory = createTreeNode("directory", {
//     [FSItemNamespaces.CORE]: {
//       [FileAttributeNames.URI]: "file://" + rootDir,
//       [FileAttributeNames.BASENAME]: path.basename(rootDir)
//     }
//   }) as Directory;

//   for (const pf of partedFiles) {
//     let current: Directory = root;
//     let prev: Directory;
//     let i = 0;
//     for (let n = pf.length; i < n - 1; i++) {
//       const part = pf[i];
//       prev = current;
//       current = current.children.find(
//         child => child.attributes[FSItemNamespaces.CORE].basename === part
//       ) as Directory;
//       if (!current) {
//         current = createTreeNode("directory", {
//           [FSItemNamespaces.CORE]: {
//             [FileAttributeNames.URI]:
//               "file://" +
//               path.join(rootDir, pf.slice(0, i + 1).join("/")) +
//               "/",
//             [FileAttributeNames.BASENAME]: part
//           }
//         }) as Directory;

//         prev.children.push(current, prev);
//       }
//     }

//     const isFile = /\./.test(pf[i]);

//     current.children.push(
//       createTreeNode(isFile ? "file" : "directory", {
//         [FSItemNamespaces.CORE]: {
//           [FileAttributeNames.URI]:
//             "file://" + path.join(rootDir, pf.join("/")) + (isFile ? "" : "/"),
//           [FileAttributeNames.BASENAME]: pf[i]
//         }
//       })
//     );
//   }

//   return root;
// };
