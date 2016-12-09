import {
  Status,
  bubble,
  Metadata,
  bindable,
  Observable
} from "@tandem/common";

import { Router } from "./router";
import { Workspace } from "./workspace";

// TODO: add workspaces
export class EditorStore extends Observable {

  @bindable(true)
  @bubble()
  public router: Router;

  @bindable(true)
  @bubble()
  public status: Status = new Status(Status.LOADING);

  @bindable()
  @bubble()
  readonly settings = new Metadata();

  @bindable()
  @bubble()
  public workspace: Workspace;
}