import {
  Status,
  bubble,
  Metadata,
  bindable,
  Observable,
  PropertyWatcher
} from "@tandem/common";

import { IUser } from "@tandem/editor/common";
import { Router } from "./router";
import { Workspace } from "./workspace";

// TODO: add workspaces
export class EditorStore extends Observable {

  @bindable(true)
  @bubble()
  public user: IUser;

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


  readonly workspaceWatcher: PropertyWatcher<EditorStore, Workspace>;

  constructor() {
    super();
    this.workspaceWatcher = new PropertyWatcher<EditorStore, Workspace>(this, "workspace");
  }
}