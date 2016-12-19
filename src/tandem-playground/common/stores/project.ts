import { 
  Kernel,
  bindable, 
  serialize, 
  deserialize, 
  serializable,
  ISerializable,
  BaseActiveRecord, 
} from "@tandem/common";

export interface IProjectData {
  _id?: string;
  content: string;
  host: string;
  updatedAt?: Date;
}

export const PROJECT_COLLECTION_NAME = "projects";


@serializable("Project")
export class Project extends BaseActiveRecord<IProjectData> implements ISerializable<IProjectData> {

  private __id: string;
  private _updatedAt: Date;
  private _host: string;

  constructor(data: IProjectData) {
    super(data, PROJECT_COLLECTION_NAME);
  }

  @bindable()
  public content: string;

  get _id() {
    return this.__id;
  }
  
  get host() {
    return this._host;
  }

  serialize() {
    return {
      _id: this.__id,
      content: this.content,
      host: this.host,
      updatedAt: new Date()
    };
  }

  setPropertiesFromSource({ _id, content, updatedAt, host }: IProjectData) {
    this.__id = _id;
    this._host = host;
    this.content = content;
    this._updatedAt = updatedAt;
  }
}

