import { IEntity } from "sf-core/entities";


export interface IEditorFile {
  ext: string;
  path: string;
  entity: IEntity;
  type: string;
  save();
}