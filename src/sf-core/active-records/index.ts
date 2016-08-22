import { IActiveRecord } from "./base";

export * from "./base";

export interface IFile extends IActiveRecord {
  path: string;
  content: string;
}
