import { IEntity } from "sf-core/entities";


export interface IFile {
  type: string;
  path: string;
  entity: IEntity;
}