import { IObservable } from "sf-core/observable";

export interface ITreeNode<T extends ITreeNode<any>> extends IObservable {
  appendChild(...children: Array<T>): void;
  removeChild(...children: Array<T>): void;
  insertChild(index: number, ...children: Array<T>): void;
  children: Array<T>;
  nextSibling: T;
  previousSibling: T;
  depth: number;
  height: number;
  parent: T;
  ancestors: Array<T>;
  root: T;
  clone(): T;
}