import {
  Status,
  bubble,
  Metadata,
  bindable,
  Observable
} from "@tandem/common";

import { Workspace } from "./workspace";
import { DirectoryModel } from "@tandem/editor/common";

// TODO: add workspaces
export class Store extends Observable {

  @bindable(true)
  @bubble()
  public status: Status = new Status(Status.LOADING);

  @bindable()
  @bubble()
  readonly settings = new Metadata();

  @bindable()
  @bubble()
  public workspace: Workspace;

  @bindable()
  @bubble()
  public cwd: DirectoryModel;
}