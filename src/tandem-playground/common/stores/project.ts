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
  updatedAt?: Date;
}

export const PROJECT_COLLECTION_NAME = "projects";

@serializable("Project")
export class Project extends BaseActiveRecord<IProjectData> implements ISerializable<IProjectData> {

  private __id: string;
  private _updatedAt: Date;

  constructor(data: IProjectData) {
    super(data, PROJECT_COLLECTION_NAME);
  }

  @bindable()
  public content: string;

  get _id() {
    return this.__id;
  }

  serialize() {
    return {
      _id: this.__id,
      content: this.content,
      updatedAt: new Date()
    };
  }

  setPropertiesFromSource({ _id, content, updatedAt }: IProjectData) {
    this.__id       = _id;
    this.content    = content;
    this._updatedAt = updatedAt;
  }
}

