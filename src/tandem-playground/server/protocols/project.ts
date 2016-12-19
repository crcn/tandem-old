import { URIProtocol } from "@tandem/sandbox";
import { DSFindRequest, DSUpdateRequest } from "@tandem/mesh";
import { Project, PROJECT_COLLECTION_NAME, IProjectData } from "tandem-playground/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { inject, KernelProvider, Kernel, PrivateBusProvider, IBrokerBus } from "@tandem/common";

export class ProjectProtocol extends URIProtocol {

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;
  
  async read(uri: string) {
    const data = (await DSFindRequest.findOne(PROJECT_COLLECTION_NAME, { _id: this.removeProtocol(uri) }, this._bus)) as IProjectData;
    if (!data) throw new Error(`project ${uri} does not exist`);
    return {
      type: TDPROJECT_MIME_TYPE,
      content: data.content
    }
  }

  async write(uri: string, content: string) {
    const _id: string = this.removeProtocol(uri);
    await this._bus.dispatch(new DSUpdateRequest(PROJECT_COLLECTION_NAME, { content }, { _id }));
  }

  async fileExists(uri: string): Promise<boolean> {
    try {
      await this.read(uri);
      return true;
    } catch(e) {
      return false;
    }
  }

  watch2(uri: string, onChange: Function) {
    return {
      dispose() {

      }
    }
  }
}

export class RemoteProjectProtocol extends URIProtocol {

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;
  
  async read(uri: string) {
    const data = (await DSFindRequest.findOne(PROJECT_COLLECTION_NAME, { _id: this.removeProtocol(uri) }, this._bus)) as IProjectData;
    if (!data) throw new Error(`project ${uri} does not exist`);
    return {
      type: TDPROJECT_MIME_TYPE,
      content: data.content
    }
  }

  async write(uri: string, content: string) {
    const _id: string = this.removeProtocol(uri);
    await this._bus.dispatch(new DSUpdateRequest(PROJECT_COLLECTION_NAME, { content }, { _id }));
  }

  async fileExists(uri: string): Promise<boolean> {
    try {
      await this.read(uri);
      return true;
    } catch(e) {
      return false;
    }
  }

  watch2(uri: string, onChange: Function) {
    return {
      dispose() {

      }
    }
  }
}