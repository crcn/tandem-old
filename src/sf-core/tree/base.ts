import { IObservable } from "sf-core/observable";

export interface ITreeBranch<T extends ITreeNode<any>, U extends ITreeNode<any>> extends Array<U>, IObservable {
  remove(...children: Array<U>): void;
  removeAll(): void;
  last: U;
  first: U;
}
export interface ITreeNode<T extends ITreeNode<any>> extends IObservable {
  addBranch(branch?: ITreeBranch<T, ITreeNode<any>>): ITreeBranch<T, ITreeNode<any>>;
  branch: ITreeBranch<ITreeNode<any>, T>;
  branches: Array<ITreeBranch<T, ITreeNode<any>>>;
  children: ITreeBranch<T, T>;
  nextSibling: T;
  previousSibling: T;
  depth: number;
  height: number;
  parent: T;
  ancestors: Array<T>;
  root: T;
  clone(): T;
}