import { Project } from "./project";
import { BaseEditorStore } from "./base";
import { CreateNewProjectRequest } from "../messages";
import { BaseActiveRecord, Observable } from "@tandem/common";

export const USER_COLLECTION_NAME = "users";

export interface IUser {
  _id: string;
  createProject(): Promise<Project>;
}

export class Anon extends BaseEditorStore implements IUser {
  readonly _id: string = null;
  async createProject(uri?: string) {
    return await CreateNewProjectRequest.dispatch(null, uri, this.bus);
  }
}
