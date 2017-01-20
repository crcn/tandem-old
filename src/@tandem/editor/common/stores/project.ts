import { URIProtocolProvider, IURIProtocolReadResult } from "@tandem/sandbox";
import { 
  inject,
  Kernel, 
  IBrokerBus,
  serializable, 
  createDataUrl,
  getProtocol,
  ISerializable, 
  KernelProvider,
  BaseActiveRecord, 
  PrivateBusProvider,
  ApplicationConfigurationProvider
} from "@tandem/common";

import { IEditorCommonConfig } from "../config";
import { UpdateProjectRequest, WatchProjectRequest } from "../messages";

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

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorCommonConfig;

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

  get sourceUri() {
    return this.uri && getProtocol(this.uri) !== "data:" ? this.uri : this.httpUrl;
  }

  get httpUrl() {
    return `${this._config.server.protocol}//${this._config.server.hostname}:${this._config.server.port}/projects/${this._id}.tandem`;
  }

  async writeSourceURI(content: string) {
    const protocolId = getProtocol(this.uri);
    const protocol   = URIProtocolProvider.lookup(this.uri, this._kernel);
    if (protocolId === "data:") {
      const previous = await protocol.read(this.uri);
      this.uri = createDataUrl(content, previous.type);
      await this.save();
    } else {
      await protocol.write(this.uri, content);
    }
    return this;
  }

  async save() {
    this._bus.dispatch(new UpdateProjectRequest(this._id, this.serialize()));
    return this;
  }

  async read() {
    const protocol = URIProtocolProvider.lookup(this.uri, this._kernel);
    return protocol.read(this.uri);
  }

  watch(onChange?: () => any) {
    return WatchProjectRequest.dispatch(this._id, this._bus, onChange);
  }

  deserialize({ owner, createdAt, updatedAt, _id, uri }: IProjectData) {
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._id = _id;
    this.uri = uri;
  }
}