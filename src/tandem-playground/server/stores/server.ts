import { BaseActiveRecord, bindable } from "@tandem/common";

export interface IServerData {
  family: string;
  uri: string;
}

export class Server extends BaseActiveRecord<IServerData> {

  @bindable(true)
  public family: string;

  @bindable(true)
  public uri: string;
  
  serialize() {
    return {
      family: this.family,
      uri: this.uri
    }
  }

  setPropertiesFromSource({ family, uri }: IServerData) {
    this.family = family;
    this.uri    = uri;
  }
}