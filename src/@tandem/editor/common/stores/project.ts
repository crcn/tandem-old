import { BaseActiveRecord, serializable, ISerializable } from "@tandem/common";

export const PROJECT_COLLECTION_NAME = "projects";

export interface IProjectData {

  // other of the project 
  owner?: string;

  createdAt?: Date;

  updatedAt?: Date;

  // project id
  _id?: string;

  // uri to the project data
  uri: string;
}

@serializable("Project")
export class Project implements ISerializable<IProjectData> {

  public owner: string;
  public createdAt: Date;
  public updatedAt: Date;
  public _id: string;
  public uri: string;

  constructor(source?: IProjectData) {
    if (source) this.deserialize(source);
  }

  serialize() {
    return {
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      _id: this._id,
      uri: this.uri
    }
  }

  deserialize({ owner, createdAt, updatedAt, _id, uri }: IProjectData) {
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._id = _id;
    this.uri = uri;
  }
}