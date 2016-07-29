import { IEntity } from "sf-core/entities";


export interface IFile {
  ext: string;
  path: string;
  entity: IEntity;
}